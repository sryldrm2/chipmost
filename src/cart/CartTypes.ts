export type CartLine = {
  id: string;        // productId
  name: string;
  supplier?: string; // tedarikçi (Mouser, LCSC, vb.)
  unitPrice: number; // birim fiyat (renamed from price for clarity)
  currency: 'USD' | 'TRY' | 'EUR';
  qty: number;
  moq?: number;      // minimum order quantity
  thumbnail?: string | null;
  inStock: boolean;  // stok durumu
};

export type CartState = {
  lines: CartLine[];
  couponCode?: string;
  discount: number;  // indirim tutarı
  deliveryNote?: string;
};
