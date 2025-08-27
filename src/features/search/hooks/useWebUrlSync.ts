import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSearchFilters } from '../SearchFilterContext';
import { filtersToUrl, urlToFilters } from '../../../services/searchApi';

export function useWebUrlSync() {
  const { state, setFilters } = useSearchFilters();
  const { filters } = state;

  // Web'de URL'den filtreleri yükle
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const urlParams = window.location.search;
      if (urlParams) {
        const urlFilters = urlToFilters(urlParams);
        if (Object.keys(urlFilters).length > 0) {
          setFilters(urlFilters);
        }
      }
    }
  }, []);

  // Web'de filtre değişiminde URL'i güncelle
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const urlParams = filtersToUrl(filters);
      const newUrl = urlParams ? `?${urlParams}` : window.location.pathname;
      
      // Replace state to avoid adding to browser history
      window.history.replaceState({}, '', newUrl);
    }
  }, [filters]);

  return null;
}
