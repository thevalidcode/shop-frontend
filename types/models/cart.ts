import { CurrencyCode } from "@/lib/currencyConverter";
import { Product } from "./product";

export interface CartItem {
  id: number;
  cartUid: string;
  productUid: string;
  quantity: number;
  price: string;
  subtotal: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  uid: string;
  userId?: number;
  items: CartItem[];
  subtotal: string;
  tax: string;
  total: string;
  currency: CurrencyCode;
  itemCount: number;
  createdAt?: string;
  updatedAt?: string;
}
