export interface Product {
  id: string;
  main_id: string;
  name: string;
  description: string;
  details: string;
  details_url: string;
  price: number;
  button_buy_label: string;
  numberOfDays: number;
}

export interface ProductAccess {
  productId: string;
  productMainId: string;
  orderId: number;
  expirationAt: string;
  createdAt: string;
  userId: string;
}
