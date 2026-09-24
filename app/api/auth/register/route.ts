import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, makeSession, sessionCookie } from "@/lib/auth";

export async function POST(req:Request){
  try{
    const body=await req.json();
    const {stageName,fullName,email,password,phone,genre,membershipPlan}=body;
    if(!stageName||!fullName||!email||!password||password.length<8) return NextResponse.json({error:"Stage name, full name, email and an 8+ character password are required."},{status:400});
    const normalized=email.trim().toLowerCase();
    const existing=await prisma.artist.findUnique({where:{email:normalized}});
    if(existing) return NextResponse.json({error:"An account with this email already exists."},{status:409});
    const artist=await prisma.artist.create({data:{stageName,fullName,email:normalized,passwordHash:hashPassword(password),phone,genre,membershipPlan:membershipPlan||"Artist"}});
    const res=NextResponse.json({ok:true,artist:{id:artist.id,stageName:artist.stageName,membershipStatus:artist.membershipStatus}});
    res.cookies.set(sessionCookie(makeSession(artist.id)));
    return res;
  }catch(e){ return NextResponse.json({error:"Unable to create account."},{status:500}); }
}
