import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  ScrollView, 
  TextInput,
  Switch,
  Platform
} from 'react-native';
import { useSearchFilters } from '../SearchFilterContext';
import { SORT_OPTIONS, STOCK_OPTIONS } from '../constants';
import { useTheme } from '../../../context/ThemeContext';
import type { SearchFilters } from '../types';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function FilterSheet({ visible, onClose }: FilterSheetProps) {
  const { colors } = useTheme();
  const { state, setFilters } = useSearchFilters();
  const { filters } = state;
  
  // Local state for form inputs
  const [localFilters, setLocalFilters] = useState<Partial<SearchFilters>>({});
  const [customPriceRange, setCustomPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    if (visible) {
      // Initialize local filters with current state
      setLocalFilters({
        price: filters.price,
        inStock: filters.inStock,
        categories: [...filters.categories],
        sort: filters.sort
      });
      
      if (filters.price) {
        setCustomPriceRange(filters.price);
      }
    }
  }, [visible, filters]);

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({
      price: null,
      inStock: null,
      categories: [],
      sort: 'relevance'
    });
    setCustomPriceRange([0, 1000]);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newRange: [number, number] = type === 'min' 
      ? [numValue, customPriceRange[1]]
      : [customPriceRange[0], numValue];
    
    setCustomPriceRange(newRange);
    setLocalFilters(prev => ({ ...prev, price: newRange }));
  };

  const handleStockToggle = (value: boolean | null) => {
    setLocalFilters(prev => ({ ...prev, inStock: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setLocalFilters(prev => {
      const categories = prev.categories || [];
      const newCategories = categories.includes(category)
        ? categories.filter(c => c !== category)
        : [...categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const handleSortChange = (sort: SearchFilters['sort']) => {
    setLocalFilters(prev => ({ ...prev, sort }));
  };

  const hasChanges = () => {
    return (
      JSON.stringify(localFilters.price) !== JSON.stringify(filters.price) ||
      localFilters.inStock !== filters.inStock ||
      JSON.stringify(localFilters.categories) !== JSON.stringify(filters.categories) ||
      localFilters.sort !== filters.sort
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: colors.primary }]}>İptal</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Gelişmiş Filtreler</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={[styles.resetButtonText, { color: colors.error }]}>Sıfırla</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Range */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Fiyat Aralığı</Text>
            <View style={styles.priceInputs}>
              <View style={styles.priceInput}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Min (₺)</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  value={customPriceRange[0].toString()}
                  onChangeText={(value) => handlePriceChange('min', value)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  accessibilityLabel="Minimum fiyat"
                />
              </View>
              <View style={styles.priceInput}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Max (₺)</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  }]}
                  value={customPriceRange[1].toString()}
                  onChangeText={(value) => handlePriceChange('max', value)}
                  keyboardType="numeric"
                  placeholder="1000"
                  placeholderTextColor={colors.textMuted}
                  accessibilityLabel="Maksimum fiyat"
                />
              </View>
            </View>
          </View>

          {/* Stock Status */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Stok Durumu</Text>
            {STOCK_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key === null ? 'all' : String(option.key)}
                style={[
                  styles.option,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  localFilters.inStock === option.key && [styles.optionSelected, { 
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.primary 
                  }]
                ]}
                onPress={() => handleStockToggle(option.key)}
                accessibilityRole="button"
                accessibilityLabel={`Stok durumu: ${option.label}`}
                accessibilityState={{ selected: localFilters.inStock === option.key || false }}
              >
                <Text style={[
                  styles.optionText,
                  { color: colors.text },
                  localFilters.inStock === option.key && [styles.optionTextSelected, { color: colors.primary }]
                ]}>
                  {option.label}
                </Text>
                {localFilters.inStock === option.key && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Kategoriler</Text>
            {['Konnektörler', 'Kablolar', 'Aksesuarlar', 'Araçlar', 'Mikrodenetleyiciler', 'Geliştirme Kartları'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.option,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  localFilters.categories?.includes(category) && [styles.optionSelected, { 
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.primary 
                  }]
                ]}
                onPress={() => handleCategoryToggle(category)}
                accessibilityRole="button"
                accessibilityLabel={`Kategori: ${category}`}
                accessibilityState={{ selected: localFilters.categories?.includes(category) || false }}
              >
                <Text style={[
                  styles.optionText,
                  { color: colors.text },
                  localFilters.categories?.includes(category) && [styles.optionTextSelected, { color: colors.primary }]
                ]}>
                  {category}
                </Text>
                {localFilters.categories?.includes(category) && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Sort Options */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Sıralama</Text>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.option,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  localFilters.sort === option.key && [styles.optionSelected, { 
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.primary 
                  }]
                ]}
                onPress={() => handleSortChange(option.key)}
                accessibilityRole="button"
                accessibilityLabel={`Sıralama: ${option.label}`}
                accessibilityState={{ selected: localFilters.sort === option.key }}
              >
                <Text style={[
                  styles.optionText,
                  { color: colors.text },
                  localFilters.sort === option.key && [styles.optionTextSelected, { color: colors.primary }]
                ]}>
                  {option.label}
                </Text>
                {localFilters.sort === option.key && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.applyButton, 
              { backgroundColor: colors.primary },
              !hasChanges() && [styles.applyButtonDisabled, { backgroundColor: colors.textMuted }]
            ]}
            onPress={handleApply}
            disabled={!hasChanges()}
            accessibilityRole="button"
            accessibilityLabel="Filtreleri uygula"
          >
            <Text style={[styles.applyButtonText, { color: colors.buttonText }]}>Uygula</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  priceInput: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  optionSelected: {
    // Tema renkleri ile override edilecek
  },
  optionText: {
    fontSize: 16,
  },
  optionTextSelected: {
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    // Tema renkleri ile override edilecek
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
