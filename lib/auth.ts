import { createHmac, randomBytes, pbkdf2Sync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE = "treko_session";
const SECRET = process.env.AUTH_SECRET || "change-me-in-production";

function b64(input:string){ return Buffer.from(input).toString("base64url"); }
function unb64(input:string){ return Buffer.from(input,"base64url").toString(); }

export function hashPassword(password:string){
  const salt=randomBytes(16).toString("hex");
  const hash=pbkdf2Sync(password,salt,120000,32,"sha256").toString("hex");
  return salt+"."+hash;
}
export function verifyPassword(password:string, stored:string){
  const [salt,hash]=stored.split(".");
  if(!salt||!hash) return false;
  const actual=pbkdf2Sync(password,salt,120000,32,"sha256").toString("hex");
  return timingSafeEqual(Buffer.from(hash,"hex"),Buffer.from(actual,"hex"));
}
function sign(payload:string){
  return createHmac("sha256",SECRET).update(payload).digest("base64url");
}
export function makeSession(artistId:string){
  const payload=b64(JSON.stringify({sub:artistId,exp:Date.now()+1000*60*60*24*30}));
  return payload+"."+sign(payload);
}
function decode(token:string){
  const [payload,sig]=token.split(".");
  if(!payload||!sig||!timingSafeEqual(Buffer.from(sig),Buffer.from(sign(payload)))) return null;
  const data=JSON.parse(unb64(payload));
  return data.exp>Date.now()?data:null;
}
export async function getCurrentArtist(){
  const token=(await cookies()).get(COOKIE)?.value;
  if(!token) return null;
  const data=decode(token);
  if(!data?.sub) return null;
  return prisma.artist.findUnique({where:{id:data.sub}});
}
export async function requireArtist(){
  const artist=await getCurrentArtist();
  if(!artist) throw new Error("UNAUTHENTICATED");
  return artist;
}
export async function requireAdmin(){
  const artist=await requireArtist();
  if(artist.role!=="ADMIN") throw new Error("FORBIDDEN");
  return artist;
}
export function sessionCookie(token:string){
  return {name:COOKIE,value:token,httpOnly:true,sameSite:"lax" as const,secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*24*30};
}
export const sessionCookieName=COOKIE;
