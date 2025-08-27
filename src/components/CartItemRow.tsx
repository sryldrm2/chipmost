import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { tl } from '../utils/money';
import { useCart } from '../cart/CartContext';
import { format } from '../utils/currency';

export default function CartItemRow({ id, name, unitPrice, currency, qty, thumbnail, inStock, moq }: {
  id: string; 
  name: string; 
  unitPrice: number; 
  currency: 'USD' | 'TRY' | 'EUR';
  qty: number; 
  thumbnail?: string | null; 
  inStock: boolean;
  moq?: number;
}) {
  const { inc, dec, removeItem } = useCart();
  
  const isMOQViolation = moq && qty < moq;
  
  return (
    <View style={styles.row}>
      {thumbnail ? <Image source={{ uri: thumbnail }} style={styles.thumb} /> :
        <View style={[styles.thumb, styles.ph]}><Text>📦</Text></View>}
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{format(unitPrice, currency)} × {qty}</Text>
          {currency !== 'TRY' && (
            <Text style={styles.priceTRY}>
              ≈ {format(unitPrice * qty, 'TRY')} (yaklaşık)
            </Text>
          )}
        </View>
        {moq && moq > 1 && (
          <Text style={styles.moqInfo}>Min. sipariş: {moq} adet</Text>
        )}
        <Text style={[styles.stockStatus, { color: inStock ? '#198754' : '#dc3545' }]}>
          {inStock ? '✓ Stokta' : '✗ Stok Yok'}
        </Text>
        {isMOQViolation && (
          <Text style={styles.moqWarning}>
            ⚠️ Minimum sipariş miktarı: {moq} adet
          </Text>
        )}
        <View style={styles.controls}>
          <Pressable onPress={() => dec(id)} style={styles.btn}><Text style={styles.btnText}>–</Text></Pressable>
          <Text style={styles.qty}>{qty}</Text>
          <Pressable onPress={() => inc(id)} style={styles.btn}><Text style={styles.btnText}>+</Text></Pressable>
          <Pressable onPress={() => removeItem(id)} style={[styles.btn, styles.rm]}><Text style={styles.rmText}>Kaldır</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ph: {
    backgroundColor: '#e5e7eb',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1f2937',
  },
  priceContainer: {
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 2,
  },
  priceTRY: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  moqInfo: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  stockStatus: {
    fontSize: 14,
    marginBottom: 8,
  },
  moqWarning: {
    fontSize: 12,
    color: '#dc2626',
    marginBottom: 8,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  qty: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    minWidth: 24,
    textAlign: 'center',
  },
  rm: {
    backgroundColor: '#fee2e2',
    marginLeft: 'auto',
  },
  rmText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
});
