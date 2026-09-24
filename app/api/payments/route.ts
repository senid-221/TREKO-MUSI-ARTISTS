import { NextResponse } from "next/server";
import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
const prices:Record<string,number>={Artist:10000,Growth:25000,Pro:50000};
export async function POST(req:Request){
  try{const artist=await requireArtist(); const {plan,phone,reference}=await req.json(); const amount=prices[plan]; if(!amount||!phone||!reference) return NextResponse.json({error:"Plan, MTN number and transaction reference are required."},{status:400}); const payment=await prisma.payment.create({data:{artistId:artist.id,amount,provider:"MTN_MOMO",phone,reference,status:"PENDING"}}); await prisma.artist.update({where:{id:artist.id},data:{membershipPlan:plan}}); return NextResponse.json({ok:true,paymentId:payment.id,status:payment.status});}catch(e:any){return NextResponse.json({error:e?.message==="UNAUTHENTICATED"?"Unauthorized":"Unable to submit payment."},{status:e?.message==="UNAUTHENTICATED"?401:500});}
}
