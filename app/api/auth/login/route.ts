import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeSession, sessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req:Request){
  const {email,password}=await req.json();
  const artist=await prisma.artist.findUnique({where:{email:String(email||"").trim().toLowerCase()}});
  if(!artist||!verifyPassword(String(password||""),artist.passwordHash)) return NextResponse.json({error:"Invalid email or password."},{status:401});
  const res=NextResponse.json({ok:true,role:artist.role,membershipStatus:artist.membershipStatus});
  res.cookies.set(sessionCookie(makeSession(artist.id)));
  return res;
}
