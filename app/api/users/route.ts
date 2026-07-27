import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";
import { validateUser } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Solo administradores pueden crear usuarios" }, { status: 401 });
  }

  const data = await request.json();
  const errors = validateUser(data);
  if (errors.length > 0) return NextResponse.json({ errors }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });

  const hashed = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashed, role: data.role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(user, { status: 201 });
}
