export interface Product {
  id: string;
  name: string;
  category?: string;
  description?: string;
  price: number;
  currency?: 'TRY' | 'USD' | 'EUR';
  inStock?: boolean;
  stockQty?: number;
  mpn?: string;
  imageUrl?: string;
  moq?: number; // minimum order quantity
}
