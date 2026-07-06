import { prisma } from "@/lib/prisma";

export type CouponResult =
  | { valid: true; code: string; discountCents: number; couponId: string }
  | { valid: false; reason: string };

/** Valida um cupom para um dado subtotal (em centavos) e retorna o desconto. */
export async function validateCoupon(code: string, subtotalCents: number): Promise<CouponResult> {
  const normalized = code.trim().toLowerCase();
  if (!normalized) return { valid: false, reason: "Informe um cupom" };

  const coupon = await prisma.coupon.findUnique({ where: { code: normalized } });
  if (!coupon || !coupon.active) return { valid: false, reason: "Cupom inválido" };
  if (coupon.expiresAt && coupon.expiresAt < new Date())
    return { valid: false, reason: "Cupom expirado" };
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
    return { valid: false, reason: "Cupom esgotado" };
  if (subtotalCents < coupon.minCents)
    return { valid: false, reason: "Subtotal mínimo não atingido" };

  const discountCents =
    coupon.type === "PERCENT"
      ? Math.round((subtotalCents * coupon.value) / 100)
      : Math.min(coupon.value, subtotalCents);

  return { valid: true, code: coupon.code, discountCents, couponId: coupon.id };
}
