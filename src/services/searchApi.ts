import type { SearchFilters, SearchResult } from '../features/search/types';
import { PRODUCTS } from '../data/products';
import type { Product } from '../types/product';

export function buildSearchQuery(f: SearchFilters): string {
  const params = new URLSearchParams();
  
  if (f.q) params.set('q', f.q);
  if (f.price) {
    params.set('min', String(f.price[0]));
    params.set('max', String(f.price[1]));
  }
  if (f.inStock !== null) params.set('inStock', String(f.inStock));
  if (f.categories.length) params.set('categories', f.categories.join(','));
  if (f.tags.length) params.set('tags', f.tags.join(','));
  params.set('sort', f.sort);
  params.set('page', String(f.page));
  params.set('pageSize', String(f.pageSize));
  
  return params.toString();
}

// Mock search function - gerçek API'ye geçiş için hazır
export async function searchProducts(f: SearchFilters, signal?: AbortSignal): Promise<SearchResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Check if aborted
  if (signal?.aborted) {
    throw new Error('Search aborted');
  }

  let results = PRODUCTS;

  // Text search
  if (f.q) {
    const query = f.q.toLowerCase();
    results = results.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.mpn?.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (f.categories.length > 0) {
    results = results.filter(product => 
      product.category && f.categories.includes(product.category)
    );
  }

  // Price filter
  if (f.price) {
    results = results.filter(product => 
      product.price >= f.price![0] && product.price <= f.price![1]
    );
  }

  // Stock filter
  if (f.inStock !== null) {
    results = results.filter(product => product.inStock === f.inStock);
  }

  // Sorting
  switch (f.sort) {
    case 'price_asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      // Mock: use ID for sorting (higher ID = newer)
      results.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case 'rating_desc':
      // Mock: random rating for demo
      results.sort(() => Math.random() - 0.5);
      break;
    default: // relevance
      // Keep original order for relevance
      break;
  }

  // Pagination
  const startIndex = (f.page - 1) * f.pageSize;
  const endIndex = startIndex + f.pageSize;
  const paginatedResults = results.slice(startIndex, endIndex);

  // Calculate facets
  const categories = PRODUCTS.reduce((acc, product) => {
    if (product.category) {
      const existing = acc.find(c => c.name === product.category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: product.category, count: 1 });
      }
    }
    return acc;
  }, [] as Array<{ name: string; count: number }>);

  const priceRange = {
    min: Math.min(...PRODUCTS.map(p => p.price)),
    max: Math.max(...PRODUCTS.map(p => p.price))
  };

  return {
    items: paginatedResults,
    total: results.length,
    facets: {
      categories,
      priceRange,
      tags: [] // Mock: no tags for now
    }
  };
}

// Web URL sync helpers
export function filtersToUrl(filters: SearchFilters): string {
  const params = new URLSearchParams();
  
  if (filters.q) params.set('q', filters.q);
  if (filters.price) {
    params.set('min', String(filters.price[0]));
    params.set('max', String(filters.price[1]));
  }
  if (filters.inStock !== null) params.set('stock', String(filters.inStock));
  if (filters.categories.length) params.set('cat', filters.categories.join(','));
  if (filters.sort !== 'relevance') params.set('sort', filters.sort);
  
  return params.toString();
}

export function urlToFilters(url: string): Partial<SearchFilters> {
  const params = new URLSearchParams(url);
  const filters: Partial<SearchFilters> = {};
  
  if (params.has('q')) filters.q = params.get('q')!;
  if (params.has('min') && params.has('max')) {
    filters.price = [Number(params.get('min')), Number(params.get('max'))];
  }
  if (params.has('stock')) {
    const stock = params.get('stock');
    filters.inStock = stock === 'true' ? true : stock === 'false' ? false : null;
  }
  if (params.has('cat')) {
    filters.categories = params.get('cat')!.split(',').filter(Boolean);
  }
  if (params.has('sort')) {
    filters.sort = params.get('sort') as any;
  }
  
  return filters;
}
