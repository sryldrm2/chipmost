import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from '../../utils/currency';

interface SearchResultCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency?: 'USD' | 'TRY' | 'EUR';
  inStock: boolean;
  moq?: number;
  onPress: () => void;
}

export default function SearchResultCard({ 
  id, 
  title, 
  description, 
  category, 
  price,
  currency = 'TRY',
  inStock,
  moq,
  onPress 
}: SearchResultCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.category}>{category}</Text>
          <View style={styles.stockContainer}>
            <View style={[
              styles.stockIndicator, 
              { backgroundColor: inStock ? '#28a745' : '#dc3545' }
            ]} />
            <Text style={[styles.stockStatus, { color: inStock ? '#28a745' : '#dc3545' }]}>
              {inStock ? '✓ Stokta' : '✗ Stok Yok'}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
      
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.id}>ID: {id}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {format(price, currency)}
            </Text>
            {currency !== 'TRY' && (
              <Text style={styles.priceTRY}>
                ≈ {format(price, 'TRY')} (yaklaşık)
              </Text>
            )}
          </View>
          {moq && moq > 1 && (
            <Text style={styles.moqInfo}>Min. sipariş: {moq} adet</Text>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.detailButton, !inStock && styles.detailButtonDisabled]}
          onPress={onPress}
          disabled={!inStock}
        >
          <Text style={[styles.detailButtonText, !inStock && styles.detailButtonTextDisabled]}>
            {inStock ? 'Detaya Git' : 'Stok Yok'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockStatus: {
    fontSize: 11,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flex: 1,
  },
  id: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  priceContainer: {
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#28a745',
    marginBottom: 2,
  },
  priceTRY: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  moqInfo: {
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  detailButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  detailButtonTextDisabled: {
    color: '#f3f4f6',
  },
});
