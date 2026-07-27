import { NextResponse } from "next/server";
import { createSession, isAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (!isAdmin(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}
