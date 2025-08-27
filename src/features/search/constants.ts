import type { SearchFilters } from './types';

export const DEFAULT_FILTERS: SearchFilters = {
  q: '',
  price: null,
  inStock: null,
  categories: [],
  tags: [],
  sort: 'relevance',
  page: 1,
  pageSize: 20
};

export const SORT_OPTIONS = [
  { key: 'relevance', label: 'İlgi Sırası' },
  { key: 'price_asc', label: 'Fiyat (Düşük → Yüksek)' },
  { key: 'price_desc', label: 'Fiyat (Yüksek → Düşük)' },
  { key: 'newest', label: 'En Yeni' },
  { key: 'rating_desc', label: 'En Yüksek Puan' }
] as const;

export const STOCK_OPTIONS = [
  { key: null, label: 'Tümü' },
  { key: true, label: 'Stokta' },
  { key: false, label: 'Stokta Yok' }
] as const;

export const PRICE_RANGES = [
  { label: '₺0-50', value: [0, 50] },
  { label: '₺50-100', value: [50, 100] },
  { label: '₺100-250', value: [100, 250] },
  { label: '₺250-500', value: [250, 500] },
  { label: '₺500+', value: [500, 9999] }
] as const;
