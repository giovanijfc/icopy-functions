import { OrderPix } from "../types/createOrderPixTypings";

export const createMercadoLivreOrderPixMapper = (
  orderPix: OrderPix
): OrderPix => {
  return {
    id: orderPix.id,
    date_created: new Date(orderPix.date_created),
    date_of_expiration: new Date(orderPix.date_of_expiration),
    payment_method_id: orderPix.payment_method_id,
    status: orderPix.status,
    status_detail: orderPix.status_detail,
    transaction_amount: orderPix.transaction_amount,
    mainProductId: orderPix.mainProductId,
    point_of_interaction: {
      transaction_data: {
        qr_code: orderPix.point_of_interaction.transaction_data.qr_code,
        qr_code_base64:
          orderPix.point_of_interaction.transaction_data.qr_code_base64,
        ticket_url: orderPix.point_of_interaction.transaction_data.ticket_url,
      },
    },
  };
};
