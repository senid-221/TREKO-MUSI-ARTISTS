import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  return handleCallback(req);
}

export async function PUT(req: Request) {
  return handleCallback(req);
}

async function handleCallback(req: Request) {
  try {
    const body = await req.json() as {
      referenceId?: string;
      status?: string;
      financialTransactionId?: string;
      reason?: string;
      externalId?: string;
    };

    const payment = body.externalId
      ? await prisma.payment.findUnique({ where: { id: body.externalId } })
      : body.referenceId
        ? await prisma.payment.findFirst({ where: { reference: body.referenceId } })
        : null;

    if (!payment) return NextResponse.json({ ok: true });

    const successful = body.status === "SUCCESSFUL";
    const failed = body.status === "FAILED";

    if (successful || failed) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: successful ? "PAID" : "FAILED",
          reference: body.referenceId || payment.reference,
          verifiedAt: successful ? new Date() : null,
        },
      });

      if (successful) {
        await prisma.artist.update({
          where: { id: payment.artistId },
          data: {
            membershipStatus: "ACTIVE",
            membershipExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
