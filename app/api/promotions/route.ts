import { NextResponse } from "next/server";
import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function POST(req:Request){
  try{const artist=await requireArtist(); if(artist.membershipStatus!=="ACTIVE") return NextResponse.json({error:"Active membership is required to request a promotion campaign."},{status:403}); const {title,goal,budget,targetAudience,platforms}=await req.json(); if(!title) return NextResponse.json({error:"Campaign/release name is required."},{status:400}); const item=await prisma.promotionRequest.create({data:{artistId:artist.id,title,goal,budget:budget?Number(budget):null,targetAudience,platforms}}); return NextResponse.json({ok:true,id:item.id,status:item.status});}catch(e:any){return NextResponse.json({error:e?.message==="UNAUTHENTICATED"?"Unauthorized":"Unable to submit promotion request."},{status:e?.message==="UNAUTHENTICATED"?401:500});}
}
