const { PrismaClient } = require("@prisma/client");
const { randomBytes, pbkdf2Sync } = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return salt + "." + hash;
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@trekomusic.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 8) {
    throw new Error("Set ADMIN_PASSWORD to a password with at least 8 characters.");
  }

  const existing = await prisma.artist.findUnique({ where: { email } });
  const passwordHash = hashPassword(password);

  const admin = existing
    ? await prisma.artist.update({
        where: { id: existing.id },
        data: {
          role: "ADMIN",
          passwordHash,
          stageName: existing.stageName || "Treko Music Admin",
          fullName: existing.fullName || "Treko Music Admin",
        },
      })
    : await prisma.artist.create({
        data: {
          stageName: "Treko Music Admin",
          fullName: "Treko Music Admin",
          email,
          passwordHash,
          role: "ADMIN",
          membershipPlan: "Admin",
          membershipStatus: "ACTIVE",
        },
      });

  console.log(`Admin account ready: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
