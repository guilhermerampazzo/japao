/** Rótulos em pt-BR para os enums do Prisma exibidos no admin. */

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Aguardando pagamento",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export const ORDER_STATUS_TONE: Record<string, "warning" | "success" | "info" | "danger" | "neutral"> = {
  PENDING: "warning",
  PAID: "success",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELED: "danger",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  PIX: "Pix",
  CARD: "Cartão",
  BOLETO: "Boleto",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  REFUNDED: "Reembolsado",
  CANCELED: "Cancelado",
};

export const COUPON_TYPE_LABELS: Record<string, string> = {
  PERCENT: "Percentual",
  FIXED: "Valor fixo",
};
