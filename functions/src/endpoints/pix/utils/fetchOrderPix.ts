import { mercadoLivreService } from "../../../services/mercadoLivreService";
import { MercadoLivreOrderPix } from "../types/createOrderPixTypings";

export const fetchOrderPix = async (id: number) => {
  try {
    const endpoint = `/payments/${id}`;

    const { data } = await mercadoLivreService.get<MercadoLivreOrderPix>(
      endpoint
    );

    return data;
  } catch {
    return undefined;
  }
};
