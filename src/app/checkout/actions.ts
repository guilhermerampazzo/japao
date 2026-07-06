"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validators";
import { validateCoupon } from "@/lib/coupon";
import { quoteShipping } from "@/lib/shipping";
import { createCheckoutPreference, isMercadoPagoConfigured } from "@/lib/mercadopago";
import { sendOrderConfirmation } from "@/lib/email";

export type CheckoutInput = {
  items: { variantId: string; quantity: number }[];
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
  };
  shippingOptionId: string;
  couponCode?: string;
};

export type CheckoutResult =
  | { ok: true; orderId: string; paymentUrl: string | null }
  | { ok: false; error: string };

function genOrderNumber(): string {
  return Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Faça login para finalizar a compra" };

  const address = addressSchema.safeParse(input.address);
  if (!address.success) return { ok: false, error: address.error.issues[0]?.message ?? "Endereço inválido" };

  if (!input.items?.length) return { ok: false, error: "Carrinho vazio" };

  // Busca variantes reais no banco — nunca confiar em preço do cliente
  const variantIds = input.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  const lines = input.items.map((item) => {
    const v = variants.find((x) => x.id === item.variantId);
    if (!v) throw new Error("Produto não encontrado");
    const qty = Math.max(1, Math.floor(item.quantity));
    if (v.stock < qty) throw new Error(`Estoque insuficiente para ${v.product.name}`);
    return { variant: v, qty };
  });

  const subtotalCents = lines.reduce((sum, l) => sum + l.variant.priceCents * l.qty, 0);
  const totalWeight = lines.reduce((g, l) => g + l.variant.product.weightGrams * l.qty, 0);

  // Frete recalculado no servidor
  const shippingOptions = await quoteShipping(input.address.cep, totalWeight, subtotalCents);
  const shipping = shippingOptions.find((o) => o.id === input.shippingOptionId) ?? shippingOptions[0];
  const shippingCents = shipping?.priceCents ?? 0;

  // Cupom
  let discountCents = 0;
  let couponId: string | null = null;
  if (input.couponCode) {
    const c = await validateCoupon(input.couponCode, subtotalCents);
    if (c.valid) {
      discountCents = c.discountCents;
      couponId = c.couponId;
    }
  }

  const totalCents = Math.max(0, subtotalCents - discountCents) + shippingCents;
  const number = genOrderNumber();

  // Transação: cria pedido + itens + baixa estoque
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        number,
        userId: session.user.id,
        status: "PENDING",
        subtotalCents,
        shippingCents,
        discountCents,
        totalCents,
        couponId,
        shipCep: address.data.cep,
        shipStreet: address.data.street,
        shipNumber: address.data.number,
        shipComplement: address.data.complement,
        shipDistrict: address.data.district,
        shipCity: address.data.city,
        shipState: address.data.state,
        items: {
          create: lines.map((l) => ({
            variantId: l.variant.id,
            productName: l.variant.product.name,
            variantName: l.variant.name,
            priceCents: l.variant.priceCents,
            quantity: l.qty,
          })),
        },
      },
    });

    for (const l of lines) {
      await tx.productVariant.update({
        where: { id: l.variant.id },
        data: { stock: { decrement: l.qty } },
      });
    }
    if (couponId) {
      await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
    }
    return created;
  });

  // Pagamento
  let paymentUrl: string | null = null;
  if (isMercadoPagoConfigured()) {
    paymentUrl = await createCheckoutPreference({
      orderId: order.id,
      orderNumber: order.number,
      items: lines.map((l) => ({
        title: l.variant.product.name,
        quantity: l.qty,
        unitPriceCents: l.variant.priceCents,
      })),
      shippingCents,
      discountCents,
      payerEmail: session.user.email ?? "",
    });
  }

  // E-mail de confirmação (não bloqueia em caso de falha)
  sendOrderConfirmation({
    to: session.user.email ?? "",
    orderNumber: order.number,
    totalCents,
    items: lines.map((l) => ({
      name: l.variant.product.name,
      quantity: l.qty,
      priceCents: l.variant.priceCents,
    })),
  }).catch((e) => console.error("Falha ao enviar e-mail:", e));

  return { ok: true, orderId: order.id, paymentUrl };
}
