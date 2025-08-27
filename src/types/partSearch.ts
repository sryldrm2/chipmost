export interface PartSearchRequest {
  partNumber: string;
  quantity: number;
}

export interface SupplierResult {
  supplier: string;
  partNumber: string;
  description: string;
  stock: number;
  moq: number;
  leadTime: string;
  price: number;
  currency: string;
  url: string;
}

export interface PartSearchResponse {
  results: SupplierResult[];
  totalResults: number;
  searchTime: number;
}
