import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { SearchStackParamList } from '../../types/navigation';
import { useSearchFilters } from '../../features/search/SearchFilterContext';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { searchProducts } from '../../services/searchApi';
import { useWebUrlSync } from '../../features/search/hooks/useWebUrlSync';
import { useTheme } from '../../context/ThemeContext';
import FilterChips from '../../features/search/components/FilterChips';
import FilterSheet from '../../features/search/components/FilterSheet';
import SearchResultsList from '../../features/search/components/SearchResultsList';

type SearchNavigationProp = StackNavigationProp<SearchStackParamList, 'SearchScreen'>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchNavigationProp>();
  const { colors } = useTheme();
  const { state, setFilters, loadMore, setError } = useSearchFilters();
  const { filters, isLoading } = state;
  
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Web URL sync
  useWebUrlSync();
  
  // Debounce search query
  const debouncedQuery = useDebounce(filters.q, 300);

  // Search effect
  useEffect(() => {
    const performSearch = async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        // Only search if there's a query or active filters
        if (debouncedQuery || filters.price || filters.inStock !== null || filters.categories.length > 0) {
          const results = await searchProducts(filters, abortControllerRef.current.signal);
          
          if (!abortControllerRef.current.signal.aborted) {
            // Update results based on page
            if (filters.page === 1) {
              // First page - replace results
              // This would be handled by the context, but for now we'll simulate it
              console.log('Search results:', results);
            } else {
              // Subsequent pages - append results
              console.log('Appending results:', results);
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message !== 'Search aborted') {
          setError(error.message);
        }
      }
    };

    performSearch();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, filters.price, filters.inStock, filters.categories, filters.sort, filters.page]);

  const handleSearch = () => {
    if (!filters.q.trim()) {
      Alert.alert('Uyarı', 'Lütfen arama terimi girin.');
      return;
    }
    
    // Reset to first page when performing new search
    setFilters({ page: 1 });
  };

  const handleLoadMore = () => {
    loadMore();
  };

  const handleRefresh = () => {
    setFilters({ page: 1 });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          🔍 Ürün Arama
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          MPN, ürün adı veya açıklama ile arama yapın
        </Text>
      </View>

      {/* Search Section */}
      <View style={[styles.searchSection, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            }]}
            placeholder="MPN, ürün adı veya açıklama..."
            placeholderTextColor={colors.textMuted}
            value={filters.q}
            onChangeText={(text) => setFilters({ q: text, page: 1 })}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            accessibilityLabel="Arama terimi girin"
          />
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.primary }]}
            onPress={handleSearch}
            disabled={!filters.q.trim()}
            accessibilityLabel="Arama yap"
          >
            <Text style={[styles.searchButtonText, { color: colors.buttonText }]}>
              {isLoading ? '🔍' : 'Ara'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Chips */}
      <FilterChips />

      {/* Advanced Filters Section */}
      <View style={[styles.advancedFiltersSection, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.advancedFiltersButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowFilterSheet(true)}
          accessibilityLabel="Gelişmiş filtreleri aç"
        >
          <Text style={[styles.advancedFiltersButtonText, { color: colors.buttonText }]}>🔧 Gelişmiş Filtreler</Text>
          </TouchableOpacity>
      </View>

      {/* Results Section */}
      <View style={styles.resultsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Arama Sonuçları {state.results ? `(${state.results.total})` : ''}
        </Text>
        
        <SearchResultsList
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
        />
      </View>

      {/* Filter Sheet */}
      <FilterSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  
  searchSection: {
    padding: 20,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  advancedFiltersSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  advancedFiltersButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  advancedFiltersButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  resultsSection: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
});
