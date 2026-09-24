import { NextResponse } from "next/server";
import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requestToPay } from "@/lib/mtn-momo";

const prices: Record<string, number> = { Artist: 10000, Growth: 25000, Pro: 50000 };

export async function POST(req: Request) {
  try {
    const artist = await requireArtist();
    const { plan, phone } = await req.json();
    const amount = prices[plan];

    if (!amount || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json({ error: "Plan and MTN number are required." }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        artistId: artist.id,
        amount,
        provider: "MTN_MOMO",
        phone: phone.trim(),
        status: "PENDING",
        externalTransactionId: undefined,
      },
    });

    try {
      const momo = await requestToPay({
        amount,
        phone,
        externalId: payment.id,
        payerMessage: `Treko Musi ${plan} membership`,
        payeeNote: `Treko Musi Rwanda - ${artist.stageName}`,
      });

      const updated = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          reference: momo.referenceId,
          currency: momo.currency,
          provider: "MTN_MOMO",
        },
      });

      await prisma.artist.update({
        where: { id: artist.id },
        data: { membershipPlan: plan },
      });

      return NextResponse.json({
        ok: true,
        paymentId: updated.id,
        status: updated.status,
        reference: updated.reference,
        currency: momo.currency,
        message: "Payment request sent. Approve it on the MTN MoMo phone.",
      });
    } catch (error: any) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      const message = error?.message === "MTN_MOMO_NOT_CONFIGURED"
        ? "MTN MoMo is not configured yet. Add the MTN MoMo credentials in the server environment."
        : "MTN MoMo payment request could not be started.";

      return NextResponse.json({ error: message, paymentId: payment.id }, { status: 503 });
    }
  } catch (e: any) {
    const status = e?.message === "UNAUTHENTICATED" ? 401 : 500;
    return NextResponse.json(
      { error: status === 401 ? "Unauthorized" : "Unable to submit payment." },
      { status }
    );
  }
}
