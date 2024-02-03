import { logger } from "firebase-functions/v1";
import { onRequest } from "firebase-functions/v2/https";
import {
  MercadoLivreNotificationBody,
  MercadoLivreNotificationQuery,
} from "./types/verifyOrderPixTypings";

import { fetchOrderPix } from "./utils/fetchOrderPix";

import admin from "firebase-admin";
import { OrderPix } from "./types/createOrderPixTypings";
import { createMercadoLivreOrderPixMapper } from "../../mappers/mercadoLivreOrderPixMappers";
import { fetchProductByMainId } from "./utils/fetchProductByMainId";
import { ProductAccess } from "../../types/productTypings";
import { addDays } from "date-fns";

export const verifyOrderPix = onRequest(async (req, res) => {
  const xSignature = req.headers["x-signature"] as string;
  const notification = req.body as MercadoLivreNotificationBody;
  const queryParams = req.query as unknown as MercadoLivreNotificationQuery;

  logger.info("Verificar ordem pix", { xSignature, queryParams, notification });

  logger.info("Verificando action");
  if (
    notification.action !== "payment.updated" &&
    notification.action !== "payment.update"
  ) {
    logger.error("Action de notificação não tratado");
    res.status(200).send({ message: "Notificação não tratada" });
    return;
  }

  logger.info("Verificando xSignature");
  if (!xSignature) {
    logger.error("xSignature não existe");
    res.status(400).send("Payload inválido");
    return;
  }

  // const { timestamp, secretHeader } =
  //   getMercadoLivreSignatureWebHook(xSignature);
  // const template = createTemplateMercadoLivreNotification(
  //   timestamp,
  //   queryParams,
  //   notification
  // );

  // const cyphedSignature = crypto
  //   .createHmac("sha256", process.env.MERCADO_LIVRE_SECRET_KEY as string)
  //   .update(Buffer.from(template, "utf-8"))
  //   .digest("hex");

  // logger.log({
  //   queryParams,
  //   secretHeader,
  //   cyphedSignature: cyphedSignature,
  // });

  // if (secretHeader !== cyphedSignature) {
  //   res.status(401).send({ message: "Tokens inválidos" });
  //   return;
  // }

  const orderId = Number(notification.data.id);

  logger.info("Buscando ordem de pix no mercado livre");
  const orderPixMercadoLivre = await fetchOrderPix(orderId);

  if (!orderPixMercadoLivre) {
    logger.error("Nenhuma ordem pix encontrada no mercado livre");
    res
      .status(404)
      .send({ message: "Nenhuma ordem pix encontrada no mercado livre" });
    return;
  }

  logger.info("Buscando ordem de pix no nosso bd");
  const orderPixRef = (
    await admin
      .firestore()
      .collection("/orders")
      .where("id", "==", orderId)
      .get()
  ).docs[0];
  let orderPixData = orderPixRef.data() as unknown as OrderPix | undefined;

  if (!orderPixData) {
    logger.error("Nenhuma ordem pix encontrada no nosso bd");
    res
      .status(404)
      .send({ message: "Nenhuma ordem pix encontrada no nosso bd" });
    return;
  }

  orderPixData = createMercadoLivreOrderPixMapper({
    ...orderPixMercadoLivre,
    mainProductId: orderPixData.mainProductId,
    userId: orderPixData.userId,
  });
  logger.info("Atualizando ordem de pix no nosso bd");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderPixRef.ref.update(orderPixData as any);

  logger.info("Buscando produto");

  const product = await fetchProductByMainId(orderPixData.mainProductId);

  if (!product) {
    logger.error("Produto não encontrado");
    res.status(404).send({ message: "Produto não encontrado" });
    return;
  }

  const productAccessCollection = admin
    .firestore()
    .collection("/product_access");

  const createdAccess = new Date();

  await productAccessCollection.add({
    productId: product.id,
    productMainId: product.main_id,
    createdAt: createdAccess.toISOString(),
    expirationAt: addDays(createdAccess, product.numberOfDays).toISOString(),
    orderId,
    userId: orderPixData.userId,
  } as ProductAccess);

  logger.info("Acesso de produto criado com sucesso");

  res.send({ message: "Verificação feita com sucesso!" });
});
