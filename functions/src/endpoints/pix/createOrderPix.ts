import { onRequest } from "firebase-functions/v2/https";
import { CreateOrderPixBody, OrderPix } from "./types/createOrderPixTypings";
import { checkAuthorization } from "../../utils/checkAuthorization";
import { logger } from "firebase-functions/v1";
import admin from "firebase-admin";

import { AxiosError } from "axios";
import { createMercadoLivreOrderPixMapper } from "../../mappers/mercadoLivreOrderPixMappers";
import { fetchProductByMainId } from "./utils/fetchProductByMainId";
import { postMercadoLivreCreateOrderPix } from "./utils/postMercadoLivreCreateOrderPix";

export const createOrderPix = onRequest(async (req, res) => {
  logger.info("Validando auth");
  const { isValidAuth, user } = await checkAuthorization(req, res);

  if (!isValidAuth || !user) {
    logger.error("Authenticação não válida", { isValidAuth, user });
    return;
  }

  const { mainProductId } = req.body as CreateOrderPixBody;

  logger.info("Validando body", {
    body: req.body,
    user: { id: user.uid, email: user.email },
  });

  if (!mainProductId) {
    logger.error("Parametro mainProductId não fornecido");
    res.status(400).send({ message: "Campo mainProductId obrigatório" });
    return;
  }

  try {
    logger.info("Buscando produto");
    const product = await fetchProductByMainId(mainProductId);

    if (!product) {
      logger.error("Produto não encontrado");
      res
        .status(404)
        .send({ message: `Produto ${mainProductId} não encontrado` });
      return;
    }

    logger.info("Criando order de pix no mercado livre");
    const orderPixResponse = await postMercadoLivreCreateOrderPix(
      product?.price
    );

    const orderPix = createMercadoLivreOrderPixMapper({
      ...orderPixResponse,
      mainProductId,
      userId: user.uid,
    });

    const orders = admin.firestore().collection("orders");
    logger.info("Salvando order de pix no nosso bd", { orderPix });
    await orders.add(orderPix as OrderPix);

    res.send({
      data: orderPix,
      message: "Ordem de pix gerada com sucesso!",
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Houve um problema ao tentar criar a ordem de pix" });
    logger.error(
      "Erro não tratado ao tentar criar ordem de pix",
      (error as AxiosError)?.response?.data || error
    );
    return;
  }
});
