import { NextResponse } from "next/server";
import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestToPayStatus } from "@/lib/mtn-momo";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const artist = await requireArtist();
    const { id } = await params;
    const payment = await prisma.payment.findFirst({ where: { id, artistId: artist.id } });

    if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });
    if (!payment.reference) return NextResponse.json({ status: payment.status, message: "No MTN reference yet." });

    const momo = await getRequestToPayStatus(payment.reference);
    const successful = momo.status === "SUCCESSFUL";
    const failed = momo.status === "FAILED";

    if (successful || failed) {
      const updated = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: successful ? "PAID" : "FAILED",
          verifiedAt: successful ? new Date() : null,
        },
      });

      if (successful) {
        await prisma.artist.update({
          where: { id: artist.id },
          data: {
            membershipStatus: "ACTIVE",
            membershipExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          },
        });
      }

      return NextResponse.json({
        status: updated.status,
        momoStatus: momo.status,
        financialTransactionId: momo.financialTransactionId || null,
        reason: momo.reason || null,
      });
    }

    return NextResponse.json({ status: payment.status, momoStatus: momo.status || "PENDING" });
  } catch (e: any) {
    const status = e?.message === "UNAUTHENTICATED" ? 401 : 502;
    return NextResponse.json({ error: status === 401 ? "Unauthorized" : "Unable to verify MTN payment." }, { status });
  }
}
