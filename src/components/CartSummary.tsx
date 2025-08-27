import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCart } from '../cart/CartContext';
import { tl } from '../utils/money';

export default function CartSummary() {
  const { subtotal, finalTotal, state, clear, applyCoupon, clearCoupon, setDeliveryNote } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // örnek kargo politikası: 150₺ üstü ücretsiz
  const shipping = useMemo(() => (finalTotal > 150 ? 0 : (state.lines.length ? 29.9 : 0)), [finalTotal, state.lines.length]);
  const total = finalTotal + shipping;

  const handleCouponApply = () => {
    if (!couponInput.trim()) return;
    
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError('Geçersiz kupon kodu');
    }
  };

  const handleCouponClear = () => {
    clearCoupon();
    setCouponInput('');
    setCouponError('');
  };

  return (
    <View style={styles.box}>
      {/* Kupon Sistemi */}
      <View style={styles.couponSection}>
        <Text style={styles.sectionTitle}>Kupon Kodu</Text>
        <View style={styles.couponRow}>
          <TextInput
            style={styles.couponInput}
            placeholder="Kupon kodunuzu girin"
            value={couponInput}
            onChangeText={setCouponInput}
            onSubmitEditing={handleCouponApply}
          />
          <Pressable style={styles.couponBtn} onPress={handleCouponApply}>
            <Text style={styles.couponBtnText}>Uygula</Text>
          </Pressable>
        </View>
        {couponError ? <Text style={styles.couponError}>{couponError}</Text> : null}
        {state.couponCode && (
          <View style={styles.appliedCoupon}>
            <Text style={styles.couponCode}>{state.couponCode}</Text>
            <Pressable onPress={handleCouponClear}>
              <Text style={styles.removeCoupon}>Kaldır</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Teslimat Notu */}
      <View style={styles.noteSection}>
        <Text style={styles.sectionTitle}>Teslimat Notu</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Siparişiniz için özel not ekleyin..."
          value={state.deliveryNote || ''}
          onChangeText={setDeliveryNote}
          multiline
          numberOfLines={2}
        />
      </View>

      {/* Fiyat Özeti */}
      <View style={styles.row}><Text>Ara Toplam</Text><Text>{tl(subtotal)}</Text></View>
      {state.discount > 0 && (
        <View style={styles.row}>
          <Text>İndirim ({state.couponCode})</Text>
          <Text style={styles.discount}>-{tl(state.discount)}</Text>
        </View>
      )}
      <View style={styles.row}><Text>Kargo</Text><Text>{shipping ? tl(shipping) : 'Ücretsiz'}</Text></View>
      <View style={[styles.row, styles.hr]} />
      <View style={styles.row}><Text style={styles.total}>Toplam</Text><Text style={styles.total}>{tl(total)}</Text></View>

      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.primary]} onPress={() => Alert.alert('Sipariş', 'Ödeme adımına geçiliyor (mock).')}>
          <Text style={styles.primaryText}>Satın Al</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => clear()}>
          <Text style={styles.btnText}>Sepeti Temizle</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#fff', padding: 16, borderRadius: 12, gap: 8 },
  
  // Kupon Sistemi
  couponSection: { gap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
  couponRow: { flexDirection: 'row', gap: 8 },
  couponInput: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#e3e3e7', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 8,
    fontSize: 14
  },
  couponBtn: { 
    backgroundColor: '#0a58ca', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 8,
    justifyContent: 'center'
  },
  couponBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  couponError: { color: '#dc3545', fontSize: 12, fontWeight: '600' },
  appliedCoupon: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#e7f1ff',
    padding: 8,
    borderRadius: 8
  },
  couponCode: { color: '#0a58ca', fontWeight: '700', fontSize: 14 },
  removeCoupon: { color: '#dc3545', fontSize: 12, fontWeight: '600' },
  
  // Teslimat Notu
  noteSection: { gap: 8 },
  noteInput: { 
    borderWidth: 1, 
    borderColor: '#e3e3e7', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 8,
    fontSize: 14,
    textAlignVertical: 'top'
  },
  
  // Fiyat Özeti
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  hr: { borderBottomWidth: 1, borderBottomColor: '#eee', marginVertical: 4 },
  total: { fontWeight: '800' },
  discount: { color: '#198754', fontWeight: '700' },
  
  // Aksiyonlar
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { flex: 1, borderWidth: 1, borderColor: '#e3e3e7', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  btnText: { fontWeight: '700' },
  primary: { backgroundColor: '#111', borderColor: '#111' },
  primaryText: { color: '#fff', fontWeight: '800' },
});
