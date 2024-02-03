import {
  MercadoLivreNotificationBody,
  MercadoLivreNotificationQuery,
} from "../types/verifyOrderPixTypings";

export const createTemplateMercadoLivreNotification = (
  timestamp: string,
  notificationQuery: MercadoLivreNotificationQuery,
  notification: MercadoLivreNotificationBody
) => {
  return (
    "post;[urlpath];data.id=[data.id_url];type=[topic_url];user-agent:mercadopago webhook v1.0;[timestamp];action:[json_action];api_version:[json_apiversion];date_created:[json_datecreated_RFC3339];id:[id_json];live_mode:[livemode_json];type:[type_json];user_id:[userid_json];"
      .replace(
        "[urlpath]",
        (process.env.MERCADO_LIVRE_WEB_HOOK as string).replace("https://", "")
      )
      // query
      .replace("[data.id_url]", notificationQuery["data.id"])
      .replace("[topic_url]", notificationQuery.type)
      // header
      .replace("[timestamp]", timestamp)
      // body
      .replace("[json_action]", notification.action)
      .replace("[json_apiversion]", notification.api_version)
      .replace("[json_datecreated_RFC3339]", notification.date_created)
      .replace("[id_json]", notification.id)
      .replace("[livemode_json]", String(notification.live_mode))
      .replace("[type_json]", notification.type)
      .replace("[userid_json]", String(notification.user_id))
  );
};
