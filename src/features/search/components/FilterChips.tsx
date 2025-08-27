import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSearchFilters } from '../SearchFilterContext';
import { PRICE_RANGES, STOCK_OPTIONS } from '../constants';
import type { SearchFilters } from '../types';

export default function FilterChips() {
  const { state, setFilters, resetFilters } = useSearchFilters();
  const { filters } = state;

  const hasActiveFilters = 
    filters.q || 
    filters.price || 
    filters.inStock !== null || 
    filters.categories.length > 0;

  const handlePriceRangeSelect = (range: [number, number]) => {
    if (filters.price && filters.price[0] === range[0] && filters.price[1] === range[1]) {
      setFilters({ price: null });
    } else {
      setFilters({ price: range });
    }
  };

  const handleStockSelect = (stock: boolean | null) => {
    if (filters.inStock === stock) {
      setFilters({ inStock: null });
    } else {
      setFilters({ inStock: stock });
    }
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ categories: newCategories });
  };

  const getActiveFiltersSummary = (): string[] => {
    const summary: string[] = [];
    
    if (filters.price) {
      summary.push(`₺${filters.price[0]}-${filters.price[1]}`);
    }
    
    if (filters.inStock !== null) {
      summary.push(filters.inStock ? 'Stokta' : 'Stokta Yok');
    }
    
    if (filters.categories.length > 0) {
      summary.push(filters.categories.join(', '));
    }
    
    return summary;
  };

  return (
    <View style={styles.container}>
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Aktif Filtreler:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getActiveFiltersSummary().map((filter, index) => (
              <View key={index} style={styles.summaryPill}>
                <Text style={styles.summaryPillText}>{filter}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Quick Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
        {/* Price Range Chips */}
        {PRICE_RANGES.map((range) => (
          <TouchableOpacity
            key={range.label}
            style={[
              styles.chip,
              filters.price && 
              filters.price[0] === range.value[0] && 
              filters.price[1] === range.value[1] && 
              styles.chipActive
            ]}
            onPress={() => handlePriceRangeSelect(range.value)}
            accessibilityRole="button"
            accessibilityLabel={`Fiyat aralığı: ${range.label}`}
            accessibilityState={{ selected: filters.price && filters.price[0] === range.value[0] && filters.price[1] === range.value[1] }}
          >
            <Text style={[
              styles.chipText,
              filters.price && 
              filters.price[0] === range.value[0] && 
              filters.price[1] === range.value[1] && 
              styles.chipTextActive
            ]}>
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Stock Chips */}
        {STOCK_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.key === null ? 'all' : String(option.key)}
            style={[
              styles.chip,
              filters.inStock === option.key && styles.chipActive
            ]}
            onPress={() => handleStockSelect(option.key)}
            accessibilityRole="button"
            accessibilityLabel={`Stok durumu: ${option.label}`}
            accessibilityState={{ selected: filters.inStock === option.key }}
          >
            <Text style={[
              styles.chipText,
              filters.inStock === option.key && styles.chipTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Category Chips */}
        {['Konnektörler', 'Kablolar', 'Aksesuarlar', 'Araçlar', 'Mikrodenetleyiciler', 'Geliştirme Kartları'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.chip,
              filters.categories.includes(category) && styles.chipActive
            ]}
            onPress={() => handleCategoryToggle(category)}
            accessibilityRole="button"
            accessibilityLabel={`Kategori: ${category}`}
            accessibilityState={{ selected: filters.categories.includes(category) }}
          >
            <Text style={[
              styles.chipText,
              filters.categories.includes(category) && styles.chipTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={resetFilters}
          accessibilityRole="button"
          accessibilityLabel="Tüm filtreleri temizle"
        >
          <Text style={styles.clearButtonText}>Temizle</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  summaryPill: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  summaryPillText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  chipsContainer: {
    paddingHorizontal: 20,
  },
  chip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f44336',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
