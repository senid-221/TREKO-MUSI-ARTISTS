-- Initial Treko Musi Artists schema
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');
CREATE TYPE "PromotionStatus" AS ENUM ('PENDING', 'APPROVED', 'RUNNING', 'COMPLETED', 'REJECTED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "UserRole" AS ENUM ('ARTIST', 'ADMIN');

CREATE TABLE "Artist" (
  "id" TEXT NOT NULL,
  "stageName" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "phone" TEXT,
  "genre" TEXT,
  "bio" TEXT,
  "avatarUrl" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'ARTIST',
  "membershipPlan" TEXT NOT NULL DEFAULT 'Artist',
  "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
  "membershipExpiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Payment" (
  "id" TEXT NOT NULL,
  "artistId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'RWF',
  "provider" TEXT NOT NULL,
  "phone" TEXT,
  "reference" TEXT,
  "externalTransactionId" TEXT,
  "proofFile" BYTEA,
  "proofMimeType" TEXT,
  "proofFilename" TEXT,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "verifiedAt" TIMESTAMP(3),
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Release" (
  "id" TEXT NOT NULL,
  "artistId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "artworkUrl" TEXT,
  "musicUrl" TEXT,
  "releasedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PromotionRequest" (
  "id" TEXT NOT NULL,
  "artistId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "goal" TEXT,
  "budget" INTEGER,
  "targetAudience" TEXT,
  "platforms" TEXT,
  "status" "PromotionStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PromotionRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommunityPost" (
  "id" TEXT NOT NULL,
  "artistId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommunityComment" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "artistId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CommunityComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommunityLike" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "artistId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CommunityLike_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Artist_email_key" ON "Artist"("email");
CREATE UNIQUE INDEX "CommunityLike_postId_artistId_key" ON "CommunityLike"("postId", "artistId");

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Release" ADD CONSTRAINT "Release_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PromotionRequest" ADD CONSTRAINT "PromotionRequest_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityLike" ADD CONSTRAINT "CommunityLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityLike" ADD CONSTRAINT "CommunityLike_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
