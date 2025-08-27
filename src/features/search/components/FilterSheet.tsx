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
import type { SearchFilters } from '../types';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function FilterSheet({ visible, onClose }: FilterSheetProps) {
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>İptal</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Gelişmiş Filtreler</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fiyat Aralığı</Text>
            <View style={styles.priceInputs}>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Min (₺)</Text>
                <TextInput
                  style={styles.input}
                  value={customPriceRange[0].toString()}
                  onChangeText={(value) => handlePriceChange('min', value)}
                  keyboardType="numeric"
                  placeholder="0"
                  accessibilityLabel="Minimum fiyat"
                />
              </View>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Max (₺)</Text>
                <TextInput
                  style={styles.input}
                  value={customPriceRange[1].toString()}
                  onChangeText={(value) => handlePriceChange('max', value)}
                  keyboardType="numeric"
                  placeholder="1000"
                  accessibilityLabel="Maksimum fiyat"
                />
              </View>
            </View>
          </View>

          {/* Stock Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stok Durumu</Text>
            {STOCK_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key === null ? 'all' : String(option.key)}
                style={[
                  styles.option,
                  localFilters.inStock === option.key && styles.optionSelected
                ]}
                onPress={() => handleStockToggle(option.key)}
                accessibilityRole="button"
                accessibilityLabel={`Stok durumu: ${option.label}`}
                accessibilityState={{ selected: localFilters.inStock === option.key }}
              >
                <Text style={[
                  styles.optionText,
                  localFilters.inStock === option.key && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
                {localFilters.inStock === option.key && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kategoriler</Text>
            {['Konnektörler', 'Kablolar', 'Aksesuarlar', 'Araçlar', 'Mikrodenetleyiciler', 'Geliştirme Kartları'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.option,
                  localFilters.categories?.includes(category) && styles.optionSelected
                ]}
                onPress={() => handleCategoryToggle(category)}
                accessibilityRole="button"
                accessibilityLabel={`Kategori: ${category}`}
                accessibilityState={{ selected: localFilters.categories?.includes(category) }}
              >
                <Text style={[
                  styles.optionText,
                  localFilters.categories?.includes(category) && styles.optionTextSelected
                ]}>
                  {category}
                </Text>
                {localFilters.categories?.includes(category) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Sort Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sıralama</Text>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.option,
                  localFilters.sort === option.key && styles.optionSelected
                ]}
                onPress={() => handleSortChange(option.key)}
                accessibilityRole="button"
                accessibilityLabel={`Sıralama: ${option.label}`}
                accessibilityState={{ selected: localFilters.sort === option.key }}
              >
                <Text style={[
                  styles.optionText,
                  localFilters.sort === option.key && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
                {localFilters.sort === option.key && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.applyButton, !hasChanges() && styles.applyButtonDisabled]}
            onPress={handleApply}
            disabled={!hasChanges()}
            accessibilityRole="button"
            accessibilityLabel="Filtreleri uygula"
          >
            <Text style={styles.applyButtonText}>Uygula</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resetButtonText: {
    color: '#f44336',
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
    color: '#333',
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
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#1976d2',
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 18,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
