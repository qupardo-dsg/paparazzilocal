import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, category, price, stock, sku, image } = await request.json();
  const product = await prisma.product.create({
    data: { name, category, price: Number(price), stock: Number(stock), sku, image },
  });
  return NextResponse.json(product, { status: 201 });
}
