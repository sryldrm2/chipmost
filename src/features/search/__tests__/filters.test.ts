import { buildSearchQuery } from '../../services/searchApi';
import { DEFAULT_FILTERS } from '../constants';
import type { SearchFilters } from '../types';

describe('Search Filters', () => {
  describe('buildSearchQuery', () => {
    it('should build empty query for default filters', () => {
      const query = buildSearchQuery(DEFAULT_FILTERS);
      expect(query).toBe('sort=relevance&page=1&pageSize=20');
    });

    it('should include search query when provided', () => {
      const filters: SearchFilters = {
        ...DEFAULT_FILTERS,
        q: 'USB'
      };
      const query = buildSearchQuery(filters);
      expect(query).toContain('q=USB');
    });

    it('should include price range when provided', () => {
      const filters: SearchFilters = {
        ...DEFAULT_FILTERS,
        price: [10, 100]
      };
      const query = buildSearchQuery(filters);
      expect(query).toContain('min=10');
      expect(query).toContain('max=100');
    });

    it('should include stock filter when provided', () => {
      const filters: SearchFilters = {
        ...DEFAULT_FILTERS,
        inStock: true
      };
      const query = buildSearchQuery(filters);
      expect(query).toContain('inStock=true');
    });

    it('should include categories when provided', () => {
      const filters: SearchFilters = {
        ...DEFAULT_FILTERS,
        categories: ['Kablolar', 'Konnektörler']
      };
      const query = buildSearchQuery(filters);
      expect(query).toContain('categories=Kablolar,Konnektörler');
    });

    it('should include sort when not relevance', () => {
      const filters: SearchFilters = {
        ...DEFAULT_FILTERS,
        sort: 'price_asc'
      };
      const query = buildSearchQuery(filters);
      expect(query).toContain('sort=price_asc');
    });

    it('should handle complex filter combination', () => {
      const filters: SearchFilters = {
        ...DEFAULT_FILTERS,
        q: 'Arduino',
        price: [5, 50],
        inStock: true,
        categories: ['Geliştirme Kartları'],
        sort: 'price_desc',
        page: 2
      };
      const query = buildSearchQuery(filters);
      expect(query).toContain('q=Arduino');
      expect(query).toContain('min=5');
      expect(query).toContain('max=50');
      expect(query).toContain('inStock=true');
      expect(query).toContain('categories=Geliştirme Kartları');
      expect(query).toContain('sort=price_desc');
      expect(query).toContain('page=2');
    });
  });

  describe('DEFAULT_FILTERS', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_FILTERS.q).toBe('');
      expect(DEFAULT_FILTERS.price).toBeNull();
      expect(DEFAULT_FILTERS.inStock).toBeNull();
      expect(DEFAULT_FILTERS.categories).toEqual([]);
      expect(DEFAULT_FILTERS.tags).toEqual([]);
      expect(DEFAULT_FILTERS.sort).toBe('relevance');
      expect(DEFAULT_FILTERS.page).toBe(1);
      expect(DEFAULT_FILTERS.pageSize).toBe(20);
    });
  });
});
