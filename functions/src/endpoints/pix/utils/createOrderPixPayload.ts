export const createOrderPixPayload = (email: string) => {
  return {
    description: "iCopy notificação 1 mês",
    payment_method_id: "pix",
    notification_url: process.env.MERCADO_LIVRE_WEB_HOOK?.concat(
      "?source_news=webhooks"
    ),
    payer: {
      email,
    },
  };
};
