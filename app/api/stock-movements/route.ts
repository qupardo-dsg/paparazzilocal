import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const movements = await prisma.stockMovement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(movements);
}

export async function POST(request: Request) {
  const { productId, change, reason } = await request.json();
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  const newStock = Math.max(0, product.stock + Number(change));

  await prisma.product.update({ where: { id: productId }, data: { stock: newStock } });

  const movement = await prisma.stockMovement.create({
    data: {
      productId,
      oldStock: product.stock,
      newStock,
      reason,
    },
  });

  return NextResponse.json(movement, { status: 201 });
}
