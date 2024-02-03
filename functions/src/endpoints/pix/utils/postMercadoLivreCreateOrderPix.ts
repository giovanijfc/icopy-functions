import { mercadoLivreService } from "../../../services/mercadoLivreService";
import { MercadoLivreOrderPix } from "../types/createOrderPixTypings";
import { v4 as uuidv4 } from "uuid";
import { createOrderPixPayload } from "./createOrderPixPayload";

interface Payload {
  email: string;
  amount: number;
}

export const postMercadoLivreCreateOrderPix = async (payload: Payload) => {
  const idEmpotencyKey = uuidv4();

  const { data: orderPixResponse } =
    await mercadoLivreService.post<MercadoLivreOrderPix>(
      "/payments",
      {
        transaction_amount: payload.amount,
        ...createOrderPixPayload(payload.email),
      },
      {
        headers: {
          "X-Idempotency-Key": idEmpotencyKey,
        },
      }
    );

  return orderPixResponse;
};
