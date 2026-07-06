import { getSiteSettings } from "@/lib/settings";

/**
 * Cálculo de frete. Usa Melhor Envio quando MELHORENVIO_TOKEN está configurado;
 * caso contrário retorna uma tabela fixa por região (fallback) para o fluxo funcionar.
 */

export type ShippingOption = {
  id: string;
  name: string;
  priceCents: number;
  deliveryDays: number;
};

const SANDBOX_BASE = "https://sandbox.melhorenvio.com.br";
const PROD_BASE = "https://melhorenvio.com.br";

export async function quoteShipping(
  destCep: string,
  weightGrams: number,
  subtotalCents: number,
): Promise<ShippingOption[]> {
  const settings = await getSiteSettings();
  const token = process.env.MELHORENVIO_TOKEN;
  const cep = destCep.replace(/\D/g, "");

  // Fallback: sem token, tabela simples por prefixo de CEP
  if (!token) return fallbackTable(cep, subtotalCents, settings.freeShippingThresholdCents);

  const base = process.env.MELHORENVIO_SANDBOX === "true" ? SANDBOX_BASE : PROD_BASE;
  try {
    const res = await fetch(`${base}/api/v2/me/shipment/calculate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Japao Nas Maos (contato@japaonasmaos.com)",
      },
      body: JSON.stringify({
        from: { postal_code: settings.originCep.replace(/\D/g, "") },
        to: { postal_code: cep },
        package: {
          weight: Math.max(0.3, weightGrams / 1000),
          width: 15,
          height: 10,
          length: 20,
        },
      }),
      cache: "no-store",
    });
    if (!res.ok) return fallbackTable(cep, subtotalCents, settings.freeShippingThresholdCents);
    const data = (await res.json()) as Array<{
      id: number;
      name: string;
      price: string;
      delivery_time: number;
      error?: string;
    }>;
    const options = data
      .filter((o) => !o.error && o.price)
      .map((o) => ({
        id: String(o.id),
        name: o.name,
        priceCents: Math.round(parseFloat(o.price) * 100),
        deliveryDays: o.delivery_time,
      }));
    return options.length
      ? options
      : fallbackTable(cep, subtotalCents, settings.freeShippingThresholdCents);
  } catch {
    return fallbackTable(cep, subtotalCents, settings.freeShippingThresholdCents);
  }
}

function fallbackTable(
  cep: string,
  subtotalCents: number,
  freeShippingThresholdCents: number,
): ShippingOption[] {
  if (subtotalCents >= freeShippingThresholdCents) {
    return [{ id: "free", name: "Frete Grátis", priceCents: 0, deliveryDays: 8 }];
  }
  const region = parseInt(cep.charAt(0) || "0", 10);
  // Sudeste (0-3) mais barato; demais regiões mais caro
  const pac = region <= 3 ? 1990 : 2990;
  const sedex = region <= 3 ? 3490 : 4790;
  return [
    { id: "pac", name: "PAC", priceCents: pac, deliveryDays: region <= 3 ? 6 : 12 },
    { id: "sedex", name: "SEDEX", priceCents: sedex, deliveryDays: region <= 3 ? 2 : 6 },
  ];
}
