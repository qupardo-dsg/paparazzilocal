import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: { disabled: !product.disabled },
  });

  return NextResponse.json(updated);
}
