import { onRequest } from "firebase-functions/v2/https";

export const health = onRequest((_, response) => {
  const currentDate = new Date();

  const responseJson = {
    status: "Online",
    currentDate,
  };

  response.send(responseJson);
});
