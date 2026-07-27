import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const orderItems = await prisma.orderItem.findMany({ select: { productId: true }, distinct: ["productId"] });
  return NextResponse.json(orderItems.map((i) => i.productId));
}
