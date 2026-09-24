import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestToPayStatus } from "@/lib/mtn-momo";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { status } = await req.json();

    if (!["PAID", "FAILED", "REFUNDED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const { id } = await params;
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });

    if (status === "PAID" && payment.provider === "MTN_MOMO") {
      if (!payment.reference) {
        return NextResponse.json({ error: "This MTN payment has no transaction reference." }, { status: 400 });
      }

      const momo = await getRequestToPayStatus(payment.reference);
      if (momo.status !== "SUCCESSFUL") {
        return NextResponse.json(
          { error: `MTN payment is not successful yet. Current status: ${momo.status || "UNKNOWN"}` },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.payment.update({
      where: { id },
      data: {
        status,
        verifiedAt: status === "PAID" ? new Date() : null,
      },
    });

    if (status === "PAID") {
      await prisma.artist.update({
        where: { id: payment.artistId },
        data: {
          membershipStatus: "ACTIVE",
          membershipExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
      });
    }

    return NextResponse.json({ ok: true, payment: updated });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" ? 403 : e?.message === "UNAUTHENTICATED" ? 401 : 502;
    return NextResponse.json(
      { error: status === 403 ? "Forbidden" : status === 401 ? "Unauthorized" : "Unable to verify payment." },
      { status }
    );
  }
}
