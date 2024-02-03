import { onRequest } from "firebase-functions/v2/https";
import { CreateOrderPixBody } from "../../types/createOrderPixTypings";
import { checkAuthorization } from "../../utils/checkAuthorization";
import { logger } from "firebase-functions/v1";
import admin from "firebase-admin";

import { AxiosError } from "axios";
import { createMercadoLivreOrderPixMapper } from "../../mappers/mercadoLivreOrderPixMappers";
import { fetchProductByMainId } from "./utils/fetchProductByMainId";
import { postMercadoLivreCreateOrderPix } from "./utils/postMercadoLivreCreateOrderPix";

export const createOrderPix = onRequest(async (req, res) => {
  const { isValidAuth, user } = await checkAuthorization(req, res);
  if (!isValidAuth || !user) return;

  const { mainProductId } = req.body as CreateOrderPixBody;

  if (!mainProductId) {
    res.status(400).send({ message: "Campo mainProductId obrigatório" });
    return;
  }

  try {
    const product = await fetchProductByMainId(mainProductId);

    if (!product) {
      res
        .status(404)
        .send({ message: `Produto ${mainProductId} não encontrado` });
      return;
    }

    const orderPixResponse = await postMercadoLivreCreateOrderPix(
      product?.price
    );

    const orderPix = createMercadoLivreOrderPixMapper({
      ...orderPixResponse,
      mainProductId,
    });

    const orders = admin.firestore().collection("orders");
    await orders.add({ ...orderPix, userId: user.uid });

    res.send({
      data: orderPix,
      message: "Ordem de pix gerada com sucesso!",
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Houve um problema ao tentar criar a ordem de pix" });
    logger.error(
      "CREATE_ORDER_PIX_ERROR",
      (error as AxiosError)?.response?.data || error
    );
    return;
  }
});
