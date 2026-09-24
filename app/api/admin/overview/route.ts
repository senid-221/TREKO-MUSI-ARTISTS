import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();
    const now = new Date();
    const [artists, activeMembers, pendingPayments, promotions, paidRevenue, pendingPromotions] = await Promise.all([
      prisma.artist.count(),
      prisma.artist.count({ where: { membershipStatus: "ACTIVE", membershipExpiresAt: { gt: now } } }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.promotionRequest.count(),
      prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
      prisma.promotionRequest.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({
      artists,
      activeMembers,
      pendingPayments,
      promotions,
      pendingPromotions,
      paidRevenueRwf: paidRevenue._sum.amount || 0,
    });
  } catch (e: any) {
    const status = e?.message === "FORBIDDEN" ? 403 : e?.message === "UNAUTHENTICATED" ? 401 : 500;
    return NextResponse.json({ error: status === 403 ? "Forbidden" : status === 401 ? "Unauthorized" : "Unable to load overview." }, { status });
  }
}
