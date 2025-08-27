import React, { useMemo, useState, useEffect } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCart } from '../cart/CartContext';
import { format } from '../utils/currency';
import { calculateTotalsTRY, validateMOQ } from '../utils/cartTotals';

export default function CartSummary() {
  const { state, clear, applyCoupon, clearCoupon, setDeliveryNote } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [totals, setTotals] = useState<{ subtotalTRY: number, shippingTRY: number, totalTRY: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // örnek kargo politikası: 150₺ üstü ücretsiz
  const shippingTRY = useMemo(() => {
    if (!totals) return 0;
    return totals.subtotalTRY > 150 ? 0 : (state.lines.length ? 29.9 : 0);
  }, [totals, state.lines.length]);

  // TRY toplamları hesapla
  useEffect(() => {
    if (state.lines.length === 0) {
      setTotals(null);
      return;
    }

    setIsCalculating(true);
    calculateTotalsTRY(state.lines, 0).then(calculatedTotals => {
      setTotals(calculatedTotals);
      setIsCalculating(false);
    });
  }, [state.lines]);

  // Kargo dahil toplam
  const finalTotalTRY = useMemo(() => {
    if (!totals) return 0;
    return totals.subtotalTRY + shippingTRY;
  }, [totals, shippingTRY]);

  // MOQ validasyonu
  const moqValidation = useMemo(() => validateMOQ(state.lines), [state.lines]);

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

  if (state.lines.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sipariş Özeti</Text>
      
      {/* Sepet Satırları */}
      {state.lines.map(line => (
        <View key={line.id} style={styles.lineItem}>
          <Text style={styles.lineName} numberOfLines={1}>{line.name}</Text>
          <View style={styles.lineDetails}>
            <Text style={styles.linePrice}>
              {format(line.unitPrice, line.currency)} × {line.qty}
            </Text>
            {line.currency !== 'TRY' && (
              <Text style={styles.linePriceTRY}>
                ≈ {isCalculating ? '...' : format(line.unitPrice * line.qty, 'TRY')} (yaklaşık)
              </Text>
            )}
          </View>
          {line.moq && line.qty < line.moq && (
            <Text style={styles.moqWarning}>
              ⚠️ Min. {line.moq} adet
            </Text>
          )}
        </View>
      ))}

      {/* Ara Toplam */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Ara Toplam:</Text>
        <Text style={styles.totalValue}>
          {isCalculating ? 'Hesaplanıyor...' : format(totals?.subtotalTRY || 0, 'TRY')}
        </Text>
      </View>

      {/* Kargo */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Kargo:</Text>
        <Text style={styles.totalValue}>
          {shippingTRY === 0 ? 'Ücretsiz' : format(shippingTRY, 'TRY')}
        </Text>
      </View>

      {/* Genel Toplam */}
      <View style={[styles.totalRow, styles.finalTotal]}>
        <Text style={styles.finalTotalLabel}>Genel Toplam:</Text>
        <Text style={styles.finalTotalValue}>
          {isCalculating ? 'Hesaplanıyor...' : format(finalTotalTRY, 'TRY')}
        </Text>
      </View>

      {/* MOQ Uyarıları */}
      {!moqValidation.ok && (
        <View style={styles.moqSection}>
          <Text style={styles.moqSectionTitle}>⚠️ Minimum Sipariş Miktarı Uyarısı</Text>
          {moqValidation.violations.map(violation => (
            <Text key={violation.id} style={styles.moqViolation}>
              • {violation.id}: {violation.need} adet gerekli (sepette {violation.have})
            </Text>
          ))}
        </View>
      )}

      {/* Kupon */}
      <View style={styles.couponSection}>
        <Text style={styles.couponTitle}>İndirim Kuponu</Text>
        <View style={styles.couponInputRow}>
          <TextInput
            style={styles.couponInput}
            value={couponInput}
            onChangeText={setCouponInput}
            placeholder="Kupon kodunu girin"
            placeholderTextColor="#9ca3af"
          />
          <Pressable style={styles.couponButton} onPress={handleCouponApply}>
            <Text style={styles.couponButtonText}>Uygula</Text>
          </Pressable>
        </View>
        {couponError ? (
          <Text style={styles.couponError}>{couponError}</Text>
        ) : state.couponCode ? (
          <View style={styles.couponApplied}>
            <Text style={styles.couponAppliedText}>
              ✓ {state.couponCode} uygulandı
            </Text>
            <Pressable onPress={handleCouponClear}>
              <Text style={styles.couponClearText}>Kaldır</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Teslimat Notu */}
      <View style={styles.noteSection}>
        <Text style={styles.noteTitle}>Teslimat Notu</Text>
        <TextInput
          style={styles.noteInput}
          value={state.deliveryNote || ''}
          onChangeText={setDeliveryNote}
          placeholder="Teslimat için özel not ekleyin (opsiyonel)"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={2}
        />
      </View>

      {/* Temizle Butonu */}
      <Pressable style={styles.clearButton} onPress={() => {
        Alert.alert(
          'Sepeti Temizle',
          'Sepetteki tüm ürünler kaldırılacak. Emin misiniz?',
          [
            { text: 'İptal', style: 'cancel' },
            { text: 'Temizle', style: 'destructive', onPress: clear }
          ]
        );
      }}>
        <Text style={styles.clearButtonText}>Sepeti Temizle</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  lineItem: {
    flexDirection: 'column',
    gap: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  lineDetails: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  linePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  linePriceTRY: {
    fontSize: 12,
    color: '#666',
  },
  moqWarning: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  finalTotal: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  finalTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  moqSection: {
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  moqSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 8,
  },
  moqViolation: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 4,
  },
  couponSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  couponButton: {
    backgroundColor: '#0a58ca',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  couponButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  couponError: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  couponApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e7f1ff',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  couponAppliedText: {
    fontSize: 13,
    color: '#0a58ca',
    fontWeight: '600',
  },
  couponClearText: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: '600',
  },
  noteSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
