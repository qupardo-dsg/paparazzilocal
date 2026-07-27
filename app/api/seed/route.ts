import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  const existing = await prisma.user.findFirst({ where: { role: "admin" } });
  if (existing) return NextResponse.json({ ok: true, message: "Admin ya existe" });

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@paparazzilocal.cl",
      password: await hashPassword("admin123"),
      role: "admin",
    },
  });

  return NextResponse.json({ ok: true, message: "Admin creado" });
}
