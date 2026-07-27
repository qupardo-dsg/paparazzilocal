import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@paparazzilocal.cl" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@paparazzilocal.cl",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });
  console.log(`Admin creado: ${admin.email}`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
