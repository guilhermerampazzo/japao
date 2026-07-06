import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";
import type { PaymentStatus } from "@prisma/client";

/**
 * Webhook do Mercado Pago. Fonte de verdade do pagamento.
 * Idempotente: reprocessar a mesma notificação não altera o pedido novamente.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ ok: true });

  // Notificação de pagamento
  const paymentId = body?.data?.id ?? body?.id;
  if (body?.type && body.type !== "payment") return NextResponse.json({ ok: true });
  if (!paymentId) return NextResponse.json({ ok: true });

  try {
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = await new Payment(client).get({ id: String(paymentId) });

    const orderId = String(payment.external_reference ?? "");
    if (!orderId) return NextResponse.json({ ok: true });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ ok: true });

    const statusMap: Record<string, PaymentStatus> = {
      approved: "APPROVED",
      rejected: "REJECTED",
      refunded: "REFUNDED",
      cancelled: "CANCELED",
      pending: "PENDING",
      in_process: "PENDING",
    };
    const payStatus = statusMap[payment.status ?? "pending"] ?? "PENDING";

    await prisma.$transaction(async (tx) => {
      await tx.payment.upsert({
        where: { orderId },
        create: {
          orderId,
          method: payment.payment_method_id === "pix" ? "PIX" : "CARD",
          status: payStatus,
          providerPaymentId: String(paymentId),
          amountCents: Math.round((payment.transaction_amount ?? 0) * 100),
          rawPayload: payment as object,
        },
        update: { status: payStatus, providerPaymentId: String(paymentId), rawPayload: payment as object },
      });

      // Só promove para PAID uma vez (idempotente)
      if (payStatus === "APPROVED" && order.status === "PENDING") {
        await tx.order.update({ where: { id: orderId }, data: { status: "PAID" } });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro no webhook Mercado Pago:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
