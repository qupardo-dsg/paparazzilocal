import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const { customer, total, items } = await request.json();
  const id = `#PZ-${String(Date.now()).slice(-6)}`;

  const order = await prisma.order.create({
    data: {
      id,
      customer,
      total,
      status: "En espera de confirmación",
      items: {
        create: items.map((i: { productId: number; quantity: number; price: number }) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json(order, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, status } = await request.json();
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { product: true } } },
  });

  // Al pasar a "Pagado", descontar stock y registrar movimiento
  if (status === "Pagado") {
    for (const item of order.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      const newStock = product.stock - item.quantity;

      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: newStock },
      });

      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          oldStock: product.stock,
          newStock,
          reason: `Venta ${order.id}`,
        },
      });
    }
  }

  return NextResponse.json(order);
}
