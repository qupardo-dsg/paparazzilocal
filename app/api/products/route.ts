import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { validateProduct } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const showDisabled = searchParams.get("showDisabled") === "true";
  const where = showDisabled ? {} : { disabled: false };
  const products = await prisma.product.findMany({ where, orderBy: { id: "asc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const data = await request.json();
  const errors = validateProduct(data);
  if (errors.length > 0) return NextResponse.json({ errors }, { status: 400 });

  const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (existing) return NextResponse.json({ error: "El SKU ya existe" }, { status: 409 });

  const product = await prisma.product.create({
    data: {
      name: data.name,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      sku: data.sku,
      image: data.image || null,
    },
  });
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const data = await request.json();
  if (!data.id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const current = await prisma.product.findUnique({ where: { id: data.id } });
  if (!current) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  const errors = validateProduct(data, current.sku);
  if (errors.length > 0) return NextResponse.json({ errors }, { status: 400 });

  if (data.sku !== current.sku) {
    const dup = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (dup) return NextResponse.json({ error: "El SKU ya existe" }, { status: 409 });
  }

  const product = await prisma.product.update({
    where: { id: data.id },
    data: {
      name: data.name,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      sku: data.sku,
      image: data.image || null,
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await request.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
