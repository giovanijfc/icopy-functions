import axios from "axios";

export const mercadoLivreService = axios.create({
  baseURL: process.env.MERCADO_LIVRE_BASE_URL?.concat("v1"),
});

mercadoLivreService.interceptors.request.use((req) => {
  req.headers.set(
    "Authorization",
    `Bearer ${process.env.MERCADO_LIVRE_ACCESS_TOKEN}`
  );

  return req;
});
