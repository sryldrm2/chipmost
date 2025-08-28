import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { format } from '../utils/currency';

type Props = {
  subtotalTRY: number;
  shippingTRY: number;
  totalTRY: number;
  isLoading?: boolean;
};

export default function CartSummary({ subtotalTRY, shippingTRY, totalTRY, isLoading = false }: Props) {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Hesaplanıyor...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Sipariş Özeti</Text>
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Ara Toplam</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {format(subtotalTRY, 'TRY')}
        </Text>
      </View>
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Kargo</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {shippingTRY === 0 ? 'Ücretsiz' : format(shippingTRY, 'TRY')}
        </Text>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
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
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 20,
    fontWeight: '800',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});





