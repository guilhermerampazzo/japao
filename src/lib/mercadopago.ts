import { MercadoPagoConfig, Preference } from "mercadopago";

export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

function client() {
  return new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string,
  });
}

export type PreferenceItem = {
  title: string;
  quantity: number;
  unitPriceCents: number;
};

/**
 * Cria uma preferência de checkout (Checkout Pro) no Mercado Pago.
 * Retorna a URL de pagamento (init_point) ou null se não configurado.
 */
export async function createCheckoutPreference(params: {
  orderId: string;
  orderNumber: string;
  items: PreferenceItem[];
  shippingCents: number;
  discountCents: number;
  payerEmail: string;
}): Promise<string | null> {
  if (!isMercadoPagoConfigured()) return null;

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const pref = new Preference(client());

  const items = params.items.map((i, idx) => ({
    id: String(idx),
    title: i.title,
    quantity: i.quantity,
    unit_price: i.unitPriceCents / 100,
    currency_id: "BRL",
  }));

  // Frete como item; desconto aplicado reduzindo via valor negativo não é permitido,
  // então tratamos desconto embutido no preço unitário no chamador quando necessário.
  if (params.shippingCents > 0) {
    items.push({
      id: "shipping",
      title: "Frete",
      quantity: 1,
      unit_price: params.shippingCents / 100,
      currency_id: "BRL",
    });
  }

  const result = await pref.create({
    body: {
      items,
      external_reference: params.orderId,
      payer: { email: params.payerEmail },
      back_urls: {
        success: `${baseUrl}/pedido/${params.orderId}`,
        failure: `${baseUrl}/pedido/${params.orderId}`,
        pending: `${baseUrl}/pedido/${params.orderId}`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      metadata: { order_number: params.orderNumber },
    },
  });

  return result.init_point ?? null;
}
