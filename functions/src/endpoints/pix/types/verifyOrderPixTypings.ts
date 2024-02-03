export interface MercadoLivreNotificationBody {
  action: "payment.updated" | "payment.update" | "payment.created";
  api_version: "v1";
  data: { id: string };
  date_created: string;
  id: string;
  live_mode: boolean;
  type: "payment";
  user_id: number;
}

export interface MercadoLivreNotificationQuery {
  "data.id": string;
  type: string;
}
