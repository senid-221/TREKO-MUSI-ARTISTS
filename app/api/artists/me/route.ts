import { NextResponse } from "next/server";
import { getCurrentArtist } from "@/lib/auth";
export async function GET(){ const artist=await getCurrentArtist(); if(!artist) return NextResponse.json({error:"Unauthorized"},{status:401}); return NextResponse.json({artist:{id:artist.id,stageName:artist.stageName,fullName:artist.fullName,email:artist.email,phone:artist.phone,genre:artist.genre,role:artist.role,membershipPlan:artist.membershipPlan,membershipStatus:artist.membershipStatus,membershipExpiresAt:artist.membershipExpiresAt}}); }
