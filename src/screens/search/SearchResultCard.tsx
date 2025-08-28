import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { format } from '../../utils/currency';
import type { PartSearchRequest } from '../../types/partSearch';

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
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={[styles.card, { 
      backgroundColor: colors.card,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <View style={styles.headerRight}>
          <Text style={[styles.category, { 
            color: colors.primary,
            backgroundColor: colors.primaryLight,
          }]}>{category}</Text>
          <View style={styles.stockContainer}>
            <View style={[
              styles.stockIndicator, 
              { backgroundColor: inStock ? colors.success : colors.error }
            ]} />
            <Text style={[styles.stockStatus, { color: inStock ? colors.success : colors.error }]}>
              {inStock ? '✓ Stokta' : '✗ Stok Yok'}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{description}</Text>
      
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={[styles.id, { color: colors.textMuted }]}>ID: {id}</Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.success }]}>
              {format(price, currency)}
            </Text>
            {currency !== 'TRY' && (
              <Text style={[styles.priceTRY, { color: colors.textMuted }]}>
                ≈ {format(price, 'TRY')} (yaklaşık)
              </Text>
            )}
          </View>
          {moq && moq > 1 && (
            <Text style={[styles.moqInfo, { color: colors.textMuted }]}>Min. sipariş: {moq} adet</Text>
          )}
        </View>
        <TouchableOpacity 
          style={[
            styles.detailButton, 
            { backgroundColor: colors.primary },
            !inStock && [styles.detailButtonDisabled, { backgroundColor: colors.textMuted }]
          ]}
          onPress={onPress}
          disabled={!inStock}
        >
          <Text style={[
            styles.detailButtonText, 
            { color: colors.buttonText },
            !inStock && [styles.detailButtonTextDisabled, { color: colors.textMuted }]
          ]}>
            {inStock ? 'Detaya Git' : 'Stok Yok'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  category: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
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
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '400',
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
    fontStyle: 'italic',
    marginBottom: 4,
  },
  priceContainer: {
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  priceTRY: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  moqInfo: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  detailButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailButtonDisabled: {
    // Tema renkleri ile override edilecek
  },
  detailButtonTextDisabled: {
    // Tema renkleri ile override edilecek
  },
});
