import nodemailer from "nodemailer";
import { formatBRL } from "@/lib/money";

function transporter() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });
}

export async function sendOrderConfirmation(params: {
  to: string;
  orderNumber: string;
  totalCents: number;
  items: { name: string; quantity: number; priceCents: number }[];
}): Promise<void> {
  const t = transporter();
  if (!t) {
    console.log(`[email] SMTP não configurado — pulando e-mail do pedido ${params.orderNumber}`);
    return;
  }

  const rows = params.items
    .map(
      (i) =>
        `<tr><td>${i.name}</td><td align="center">${i.quantity}</td><td align="right">${formatBRL(
          i.priceCents * i.quantity,
        )}</td></tr>`,
    )
    .join("");

  await t.sendMail({
    from: process.env.SMTP_FROM ?? "Japão Nas Mãos <no-reply@japaonasmaos.com>",
    to: params.to,
    subject: `Pedido #${params.orderNumber} confirmado — Japão Nas Mãos`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h1 style="color:#b50061">Obrigada pela sua compra! 💗</h1>
        <p>Seu pedido <strong>#${params.orderNumber}</strong> foi recebido.</p>
        <table width="100%" cellpadding="8" style="border-collapse:collapse">
          <thead><tr style="border-bottom:1px solid #eee"><th align="left">Produto</th><th>Qtd</th><th align="right">Total</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="text-align:right;font-size:18px;color:#b50061"><strong>Total: ${formatBRL(
          params.totalCents,
        )}</strong></p>
        <p style="color:#666">Japão Nas Mãos — Skincare asiático premium.</p>
      </div>`,
  });
}
