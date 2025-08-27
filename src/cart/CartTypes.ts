export type CartLine = {
  id: string;        // productId
  name: string;
  price: number;     // birim fiyat
  qty: number;
  thumbnail?: string | null;
  inStock: boolean;  // stok durumu
};

export type CartState = {
  lines: CartLine[];
  couponCode?: string;
  discount: number;  // indirim tutarı
  deliveryNote?: string;
};
