import { NextResponse } from "next/server";
import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const prices: Record<string, number> = { Artist: 10000, Growth: 25000, Pro: 50000 };
const allowedTypes = new Set(["image/jpeg", "application/pdf"]);
const maxBytes = 5 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const artist = await requireArtist();
    const form = await req.formData();
    const plan = String(form.get("plan") || "");
    const phone = String(form.get("phone") || "").trim();
    const proof = form.get("proof");

    const amount = prices[plan];
    if (!amount || !phone) {
      return NextResponse.json({ error: "Plan and MTN number are required." }, { status: 400 });
    }

    if (!(proof instanceof File)) {
      return NextResponse.json({ error: "Please upload a payment screenshot or PDF." }, { status: 400 });
    }
    if (!allowedTypes.has(proof.type)) {
      return NextResponse.json({ error: "Only JPG/JPEG images and PDF files are accepted." }, { status: 400 });
    }
    if (proof.size > maxBytes) {
      return NextResponse.json({ error: "Payment proof must be 5 MB or smaller." }, { status: 400 });
    }

    const bytes = Buffer.from(await proof.arrayBuffer());
    const payment = await prisma.payment.create({
      data: {
        artistId: artist.id,
        amount,
        provider: "WHATSAPP_MANUAL",
        phone,
        proofFile: bytes,
        proofMimeType: proof.type,
        proofFilename: proof.name,
        status: "PENDING",
      },
    });

    await prisma.artist.update({
      where: { id: artist.id },
      data: { membershipPlan: plan },
    });

    return NextResponse.json({
      ok: true,
      paymentId: payment.id,
      status: payment.status,
      message: "Payment proof submitted. Treko Musi will review it and approve your membership.",
    });
  } catch (e: any) {
    const status = e?.message === "UNAUTHENTICATED" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "Unauthorized" : "Unable to submit payment proof." },
      { status }
    );
  }
}
