/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "../../../types/productTypings";
import admin from "firebase-admin";

export const fetchProductByMainId = async (mainId: string) => {
  const productsString = (
    (await admin.remoteConfig().getTemplate()).parameters.products
      ?.defaultValue as any
  )?.value;

  if (!productsString) return undefined;

  const products = JSON.parse(productsString) as Product[];

  return products.find((p) => p.main_id === mainId);
};
