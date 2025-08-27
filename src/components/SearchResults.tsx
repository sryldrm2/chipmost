import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../cart/CartContext';
import { SupplierResult } from '../types/partSearch';

interface SearchResultsProps {
  results: SupplierResult[];
  isLoading: boolean;
  searchTime?: number;
}

export default function SearchResults({ results, isLoading, searchTime }: SearchResultsProps) {
  const { colors } = useTheme();
  const { addItem } = useCart();

  const handleAddToCart = (result: SupplierResult) => {
    // Cart item formatına dönüştür
    const cartItem = {
      id: `${result.supplier}-${result.partNumber}`,
      name: `${result.partNumber} - ${result.supplier}`,
      price: result.price,
      thumbnail: null,
      inStock: result.stock > 0,
    };

    addItem(cartItem, 1);
    
    Alert.alert(
      'Başarılı',
      `${result.partNumber} sepetinize eklendi!`,
      [{ text: 'Tamam', style: 'default' }]
    );
  };

  const renderResultItem = ({ item }: { item: SupplierResult }) => (
    <View
      style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      {/* Supplier Header */}
      <View style={styles.supplierHeader}>
        <View style={[styles.supplierBadge, { backgroundColor: getSupplierColor(item.supplier) }]}>
          <Text style={styles.supplierText}>{item.supplier}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.accent }]}>
            {item.price.toFixed(2)} {item.currency}
          </Text>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Birim Fiyat</Text>
        </View>
      </View>

      {/* Part Info */}
      <View style={styles.partInfo}>
        <Text style={[styles.partNumber, { color: colors.text }]} numberOfLines={1}>
          {item.partNumber}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      {/* Stock and Lead Time */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="cube" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            Stok: {item.stock.toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {item.leadTime}
          </Text>
        </View>
      </View>

      {/* MOQ */}
      <View style={styles.moqContainer}>
        <Text style={[styles.moqLabel, { color: colors.textSecondary }]}>
          Minimum Sipariş Miktarı:
        </Text>
        <Text style={[styles.moqValue, { color: colors.text }]}>
          {item.moq} adet
        </Text>
      </View>

      {/* Add to Cart Button */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.accent }]}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="cart-outline" size={16} color="#fff" />
          <Text style={styles.addToCartButtonText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Arama yapılıyor...
        </Text>
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Henüz arama yapılmadı
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Parça numarası girip arama yapın
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsTitle, { color: colors.text }]}>
          {results.length} sonuç bulundu
        </Text>
        {searchTime && (
          <Text style={[styles.searchTime, { color: colors.textSecondary }]}>
            {searchTime}ms
          </Text>
        )}
      </View>

      {/* Results List */}
      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.supplier}-${index}`}
        renderItem={renderResultItem}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </View>
  );
}

// Supplier renkleri
function getSupplierColor(supplier: string): string {
  const colors: { [key: string]: string } = {
    'Digi-Key': '#CC0000',
    'Mouser': '#004990',
    'Farnell': '#FF6600',
    'LCSC': '#00A0E9',
  };
  return colors[supplier] || '#666666';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchTime: {
    fontSize: 14,
  },
  resultsList: {
    padding: 20,
  },
  resultCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  supplierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  supplierText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  priceLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  partInfo: {
    marginBottom: 12,
  },
  partNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 6,
  },
  moqContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  moqLabel: {
    fontSize: 14,
  },
  moqValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionRow: {
    alignItems: 'center',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});
