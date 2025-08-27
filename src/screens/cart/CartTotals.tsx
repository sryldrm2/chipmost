import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { format } from '../../utils/currency';

interface CartTotalsProps {
  subtotalTRY: number;
  shippingTRY: number;
  totalTRY: number;
  isLoading?: boolean;
}

export default function CartTotals({ subtotalTRY, shippingTRY, totalTRY, isLoading = false }: CartTotalsProps) {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Sipariş Özeti</Text>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Hesaplanıyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Sipariş Özeti</Text>
      
      {/* Ara Toplam */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Ara Toplam</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {format(subtotalTRY, 'TRY')}
        </Text>
      </View>
      
      {/* Kargo */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Kargo</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {shippingTRY === 0 ? 'Ücretsiz' : format(shippingTRY, 'TRY')}
        </Text>
      </View>
      
      {/* Ayırıcı */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      {/* Genel Toplam */}
      <View style={styles.row}>
        <Text style={[styles.totalLabel, { color: colors.text }]}>Genel Toplam</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>
          {format(totalTRY, 'TRY')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
});
