import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupon";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const code = String(body?.code ?? "");
  const subtotalCents = Number(body?.subtotalCents ?? 0);
  const result = await validateCoupon(code, subtotalCents);
  return NextResponse.json(result);
}
