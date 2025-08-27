export type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating_desc';

export type SearchFilters = {
  q: string;
  price: [number, number] | null;   // [min,max]
  inStock: boolean | null;          // null = fark etmez
  categories: string[];             // çoklu seçim
  tags: string[];                   // (varsa) etiket/özellik filtreleri
  sort: SortKey;
  page: number;                     // 1 tabanlı
  pageSize: number;
};

export type SearchResult = {
  items: Product[];
  total: number;
  facets?: {
    categories: Array<{ name: string; count: number }>;
    priceRange: { min: number; max: number };
    tags: Array<{ name: string; count: number }>;
  };
};

export type SearchState = {
  filters: SearchFilters;
  results: SearchResult | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
};

// Mevcut Product tipini import et
import type { Product } from '../../types/product';
