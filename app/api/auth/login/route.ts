import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeSession, sessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req:Request){
  const {email,password}=await req.json();
  const normalizedEmail=String(email||"").trim().toLowerCase();
  const plainPassword=String(password||"");
  const artist=await prisma.artist.findUnique({where:{email:normalizedEmail}});

  const adminEmail=(process.env.ADMIN_EMAIL||"admin@trekomusic.com").trim().toLowerCase();
  const adminPassword=process.env.ADMIN_PASSWORD||"";

  const validAdmin =
    normalizedEmail === adminEmail &&
    !!adminPassword &&
    plainPassword === adminPassword &&
    artist?.role === "ADMIN";

  const validArtist = !!artist && verifyPassword(plainPassword, artist.passwordHash);

  if(!artist || (!validAdmin && !validArtist))
    return NextResponse.json({error:"Invalid email or password."},{status:401});

  const res=NextResponse.json({ok:true,role:artist.role,membershipStatus:artist.membershipStatus});
  res.cookies.set(sessionCookie(makeSession(artist.id)));
  return res;
}
