import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { tl } from '../utils/money';
import { useCart } from '../cart/CartContext';

export default function CartItemRow({ id, name, price, qty, thumbnail, inStock }: {
  id: string; name: string; price: number; qty: number; thumbnail?: string | null; inStock: boolean;
}) {
  const { inc, dec, removeItem } = useCart();
  return (
    <View style={styles.row}>
      {thumbnail ? <Image source={{ uri: thumbnail }} style={styles.thumb} /> :
        <View style={[styles.thumb, styles.ph]}><Text>📦</Text></View>}
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.price}>{tl(price)}</Text>
        <Text style={[styles.stockStatus, { color: inStock ? '#198754' : '#dc3545' }]}>
          {inStock ? '✓ Stokta' : '✗ Stok Yok'}
        </Text>
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
  row: { flexDirection: 'row', gap: 12, backgroundColor: '#f7f7f9', padding: 12, borderRadius: 12, marginBottom: 10 },
  thumb: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  ph: { backgroundColor: '#eee' },
  name: { fontSize: 14, fontWeight: '700' },
  price: { fontSize: 12, color: '#198754', marginTop: 2 },
  stockStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  btn: { borderWidth: 1, borderColor: '#e3e3e7', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  btnText: { fontSize: 14, fontWeight: '800' },
  qty: { minWidth: 24, textAlign: 'center', fontWeight: '700' },
  rm: { borderColor: '#dc3545' },
  rmText: { color: '#dc3545', fontWeight: '700' },
});
