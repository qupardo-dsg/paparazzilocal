import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  // Orders not in DB yet — return empty array.
  // When orders are migrated, query: prisma.order.findMany({ select: { lineItems: { select: { productId: true } } } })
  return NextResponse.json([]);
}
