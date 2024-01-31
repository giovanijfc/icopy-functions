import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

export const getDate = onRequest((request, response) => {
  const currentDate = new Date();

  logger.log("getDate/currentDate/v2", currentDate);

  response.send({
    message: "Segue a data ",
    data: `${currentDate.getDate().toString().padStart(2, "0")}/${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()}`,
  });
});
