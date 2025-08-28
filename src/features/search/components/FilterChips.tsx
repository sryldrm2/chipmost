import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSearchFilters } from '../SearchFilterContext';
import { PRICE_RANGES, STOCK_OPTIONS } from '../constants';
import { useTheme } from '../../../context/ThemeContext';
import type { SearchFilters } from '../types';

export default function FilterChips() {
  const { colors } = useTheme();
  const { state, setFilters, resetFilters } = useSearchFilters();
  const { filters } = state;

  const hasActiveFilters = 
    filters.q || 
    filters.price || 
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
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <View style={styles.summaryContainer}>
          <Text style={[styles.summaryTitle, { color: colors.textSecondary }]}>Aktif Filtreler:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getActiveFiltersSummary().map((filter, index) => (
              <View key={index} style={[styles.summaryPill, { 
                backgroundColor: colors.primaryLight, 
                borderColor: colors.primary 
              }]}>
                <Text style={[styles.summaryPillText, { color: colors.primary }]}>{filter}</Text>
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
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              filters.price && 
              filters.price[0] === range.value[0] && 
              filters.price[1] === range.value[1] && 
              [styles.chipActive, { 
                backgroundColor: colors.primary,
                borderColor: colors.primary 
              }]
            ]}
            onPress={() => handlePriceRangeSelect(range.value as [number, number])}
            accessibilityRole="button"
            accessibilityLabel={`Fiyat aralığı: ${range.label}`}
            accessibilityState={{ selected: !!(filters.price && filters.price[0] === range.value[0] && filters.price[1] === range.value[1]) }}
          >
            <Text style={[
              styles.chipText,
              { color: colors.textSecondary },
              filters.price && 
              filters.price[0] === range.value[0] && 
              filters.price[1] === range.value[1] && 
              [styles.chipTextActive, { color: colors.buttonText }]
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
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              filters.inStock === option.key && [styles.chipActive, { 
                backgroundColor: colors.primary,
                borderColor: colors.primary 
              }]
            ]}
            onPress={() => handleStockSelect(option.key)}
            accessibilityRole="button"
            accessibilityLabel={`Stok durumu: ${option.label}`}
            accessibilityState={{ selected: filters.inStock === option.key || false }}
          >
            <Text style={[
              styles.chipText,
              { color: colors.textSecondary },
              filters.inStock === option.key && [styles.chipTextActive, { color: colors.buttonText }]
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
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              filters.categories.includes(category) && [styles.chipActive, { 
                backgroundColor: colors.primary,
                borderColor: colors.primary 
              }]
            ]}
            onPress={() => handleCategoryToggle(category)}
            accessibilityRole="button"
            accessibilityLabel={`Kategori: ${category}`}
            accessibilityState={{ selected: filters.categories.includes(category) }}
          >
            <Text style={[
              styles.chipText,
              { color: colors.textSecondary },
              filters.categories.includes(category) && [styles.chipTextActive, { color: colors.buttonText }]
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: colors.error }]}
          onPress={resetFilters}
          accessibilityRole="button"
          accessibilityLabel="Tüm filtreleri temizle"
        >
          <Text style={[styles.clearButtonText, { color: colors.buttonText }]}>Temizle</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  summaryPillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chipsContainer: {
    paddingHorizontal: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  chipActive: {
    // Tema renkleri ile override edilecek
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextActive: {
    // Tema renkleri ile override edilecek
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
