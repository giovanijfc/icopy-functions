export const CREATE_PIX_PAYLOAD = {
  description: "iCopy notificação 1 mês",
  payment_method_id: "pix",
  notification_url: "https://url-webhook.com",
  payer: {
    email: "giovanijfc@gmail.com",
    first_name: "Giovani",
    last_name: "Chiodi",
    identification: {
      type: "CPF",
      number: "13115240619",
    },
    address: {
      zip_code: "32412297",
      street_name: "Av. altivas caldas",
      street_number: "290",
      neighborhood: "Novo Horizonte",
      city: "Ibirité",
      federal_unit: "MG",
    },
  },
};
