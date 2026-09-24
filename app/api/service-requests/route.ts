import { NextResponse } from "next/server";
import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const prices:Record<string,number>={Artist:10000,Growth:25000,Pro:50000};
const services=new Set(["community","promotion","distribution"]);

export async function POST(req:Request){
 try{
  const artist=await requireArtist();
  const body=await req.json();
  const service=String(body.service||"");
  const plan=String(body.plan||"");
  const amount=prices[plan];
  if(!services.has(service)||!amount) return NextResponse.json({error:"Service and plan are required."},{status:400});
  const request=await prisma.serviceRequest.create({data:{artistId:artist.id,service,plan,amount}});
  return NextResponse.json({ok:true,requestId:request.id,status:request.status,plan,amount});
 }catch(e:any){
  return NextResponse.json({error:e?.message==="UNAUTHENTICATED"?"Please login first.":"Unable to submit request."},{status:e?.message==="UNAUTHENTICATED"?401:500});
 }
}