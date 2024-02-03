import { CREATE_PIX_PAYLOAD } from "../../../constants/CREATE_PIX_PAYLOAD";
import { mercadoLivreService } from "../../../services/mercadoLivreService";
import { CreateMercadoLivreOrderPix } from "../../../types/createOrderPixTypings";
import { v4 as uuidv4 } from "uuid";

export const postMercadoLivreCreateOrderPix = async (amount: number) => {
  const idEmpotencyKey = uuidv4();

  const { data: orderPixResponse } =
    await mercadoLivreService.post<CreateMercadoLivreOrderPix>(
      "/payments",
      {
        transaction_amount: amount,
        ...CREATE_PIX_PAYLOAD,
      },
      {
        headers: {
          "X-Idempotency-Key": idEmpotencyKey,
        },
      }
    );

  return orderPixResponse;
};
