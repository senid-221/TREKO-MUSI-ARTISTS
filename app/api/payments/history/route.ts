import { NextResponse } from "next/server";
import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const artist = await requireArtist();
    const payments = await prisma.payment.findMany({
      where: { artistId: artist.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, amount: true, currency: true, provider: true, phone: true, reference: true, status: true, createdAt: true, verifiedAt: true },
    });
    return NextResponse.json({ payments });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message === "UNAUTHENTICATED" ? "Unauthorized" : "Unable to load payment history." }, { status: e?.message === "UNAUTHENTICATED" ? 401 : 500 });
  }
}
