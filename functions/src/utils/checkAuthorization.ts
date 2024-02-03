import { Request, Response } from "firebase-functions/v1";
import { DefaultHeaders } from "../types/requestTypings";

import admin from "firebase-admin";
import { isBefore } from "date-fns";

export const checkAuthorization = async (req: Request, res: Response) => {
  const { authorization } = req.headers as unknown as DefaultHeaders;

  if (!authorization) {
    res
      .status(401)
      .send({ message: "Falha na autenticação, token não encontrado" });
    return { isValidAuth: false };
  }

  try {
    const tokenInfo = await admin
      .auth()
      .verifyIdToken(authorization.split(" ")[1], true);

    return {
      isValidAuth: isBefore(tokenInfo.exp, new Date()),
      user: tokenInfo,
    };
  } catch (error) {
    res
      .status(401)
      .send({ message: "Falha na autenticação, token inválido", error });
  }

  return { isValidAuth: false };
};
