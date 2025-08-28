import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../cart/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { validateMOQ, calculateTotalsTRY } from '../../utils/cartTotals';
import CartLineItem from './CartLineItem';
import CartTotals from './CartTotals';
import StickyCTA from './StickyCTA';

export default function CartScreen() {
  const nav = useNavigation<any>();
  const { state, totalCount } = useCart();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [totals, setTotals] = useState<{ subtotalTRY: number, shippingTRY: number, totalTRY: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // MOQ validasyonu
  const moqValidation = validateMOQ(state.lines);
  
  // Kargo hesaplama (150₺ üstü ücretsiz)
  const shippingTRY = totals && totals.subtotalTRY > 150 ? 0 : (state.lines.length ? 29.9 : 0);
  
  // TRY toplamları hesapla
  useEffect(() => {
    if (state.lines.length === 0) {
      setTotals(null);
      return;
    }

    let alive = true;
    setIsCalculating(true);
    
    calculateTotalsTRY(state.lines, 0).then(calculatedTotals => {
      if (alive) {
        setTotals(calculatedTotals);
        setIsCalculating(false);
      }
    });
    
    return () => { alive = false; };
  }, [state.lines]);
  
  // Kargo dahil toplam
  const finalTotalTRY = totals ? totals.subtotalTRY + shippingTRY : 0;

  // Boş sepet durumu
  if (!state.lines.length) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContent}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Sepetin boş</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Ürün ekleyerek alışverişe başlayabilirsin
          </Text>
          <Pressable 
            style={[styles.emptyCTA, { backgroundColor: colors.primary }]} 
            onPress={() => nav.reset({ index: 0, routes: [{ name: 'CatalogHome' }] })}
          >
            <Text style={[styles.emptyCTAText, { color: colors.buttonText }]}>
              Alışverişe Dön
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleCheckout = () => {
    if (!moqValidation.ok) {
      Alert.alert(
        'Minimum Sipariş Miktarı Uyarısı',
        'Bazı ürünlerde minimum sipariş miktarı karşılanmamış. Lütfen ürün miktarlarını kontrol edin.',
        [{ text: 'Tamam', style: 'default' }]
      );
      return;
    }
    
    nav.navigate('Checkout');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 120 + insets.bottom } // Sticky CTA için alan
        ]}
        data={state.lines}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.buttonText }]}>
                {totalCount} ürün
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <CartLineItem 
            item={{
              ...item,
              supplier: item.supplier || 'Chipmost' // Varsayılan supplier
            }}
          />
        )}
        ListFooterComponent={
          <CartTotals
            subtotalTRY={totals?.subtotalTRY || 0}
            shippingTRY={shippingTRY}
            totalTRY={finalTotalTRY}
            isLoading={isCalculating}
          />
        }
      />
      
      {/* Sticky CTA */}
      <StickyCTA
        onCheckout={handleCheckout}
        isCheckoutDisabled={!moqValidation.ok}
        moqViolations={moqValidation.violations}
        totalItems={totalCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
    lineHeight: 22,
  },
  emptyCTA: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyCTAText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
