export interface PartSearchRequest {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  supplier?: string;
}

export interface PartSearchResult {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: 'USD' | 'TRY' | 'EUR';
  inStock: boolean;
  stockQty?: number;
  category?: string;
  mpn?: string;
  imageUrl?: string;
  moq?: number;
}

export interface SupplierResult {
  supplierName: string;
  results: PartSearchResult[];
}

export interface PartSearchResponse {
  results: SupplierResult[];
  searchTime: number;
  totalResults: number;
}






