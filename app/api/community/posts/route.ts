import { NextResponse } from "next/server";
import { requireArtist } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.communityPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      artist: { select: { stageName: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  try {
    const artist = await requireArtist();
    if (artist.membershipStatus !== "ACTIVE") return NextResponse.json({ error: "Active membership is required." }, { status: 403 });
    const { content } = await req.json();
    if (!content?.trim()) return NextResponse.json({ error: "Post content is required." }, { status: 400 });
    const post = await prisma.communityPost.create({ data: { artistId: artist.id, content: content.trim() } });
    return NextResponse.json({ ok: true, post });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message === "UNAUTHENTICATED" ? "Unauthorized" : "Unable to create post." }, { status: e?.message === "UNAUTHENTICATED" ? 401 : 500 });
  }
}