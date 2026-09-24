import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const payment = await prisma.payment.findUnique({
      where: { id },
      select: { proofFile: true, proofMimeType: true, proofFilename: true },
    });
    if (!payment?.proofFile || !payment.proofMimeType) {
      return NextResponse.json({ error: "Payment proof not found." }, { status: 404 });
    }

    return new NextResponse(payment.proofFile, {
      headers: {
        "Content-Type": payment.proofMimeType,
        "Content-Disposition": `inline; filename="${(payment.proofFilename || "payment-proof").replace(/["\\\r\n]/g, "")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" ? 403 : e?.message === "UNAUTHENTICATED" ? 401 : 500;
    return NextResponse.json({ error: status === 403 ? "Forbidden" : "Unauthorized" }, { status });
  }
}
