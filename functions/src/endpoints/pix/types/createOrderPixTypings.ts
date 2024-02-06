export interface CreateOrderPixBody {
  mainProductId: string;
}

export interface MercadoLivreOrderPix {
  id: number;
  date_created: Date;
  date_of_expiration: Date;
  status: "pending" | "approved" | "authorized" | "refunded" | "chargedback" ;
  payment_method_id: "pix";
  status_detail: "pending_waiting_transfer";
  transaction_amount: number;
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      ticket_url: string;
      qr_code_base64: string;
    };
  };
}

export interface OrderPix extends MercadoLivreOrderPix {
  mainProductId: string;
  productId: string
  userId: string
}
