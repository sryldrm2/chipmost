import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../cart/CartContext';
import CartItemRow from '../../components/CartItemRow';
import CartSummary from '../../components/CartSummary';
import { useTheme } from '../../context/ThemeContext';

export default function CartScreen() {
  const nav = useNavigation<any>();
  const { state, totalCount } = useCart();
  const { colors } = useTheme();

  if (!state.lines.length) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Sepetin boş</Text>
        <Text style={[styles.muted, { color: colors.textSecondary }]}>Ürün ekleyerek alışverişe başlayabilirsin.</Text>
        <Pressable style={[styles.cta, { backgroundColor: colors.buttonPrimary }]} onPress={() => nav.reset({ index: 0, routes: [{ name: 'CatalogHome' }] })}>
          <Text style={[styles.ctaText, { color: colors.buttonText }]}>Alışverişe Dön</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={state.lines}
      keyExtractor={(x) => x.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Chipmost – Sepet</Text>
          <Text style={[styles.badge, { color: colors.primary, backgroundColor: colors.surface }]}>{totalCount} ürün</Text>
        </View>
      }
      renderItem={({ item }) => (
        <CartItemRow 
          id={item.id} 
          name={item.name} 
          price={item.price} 
          qty={item.qty} 
          thumbnail={item.thumbnail}
          inStock={item.inStock}
        />
      )}
      ListFooterComponent={
        <>
          <CartSummary />
          
          {/* Checkout Button */}
          <View style={styles.checkoutSection}>
            <Pressable 
              style={[styles.checkoutButton, { backgroundColor: colors.success }]}
              onPress={() => nav.navigate('Checkout')}
            >
              <Text style={[styles.checkoutButtonText, { color: colors.buttonText }]}>Ödemeye Geç</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.buttonText} />
            </Pressable>
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '800' },
  muted: { },
  cta: { marginTop: 8, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  ctaText: { fontWeight: '800' },

  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800' },
  badge: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  
  checkoutSection: { marginTop: 24, paddingHorizontal: 16 },
  checkoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 16, 
    borderRadius: 12, 
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  checkoutButtonText: { fontSize: 16, fontWeight: '700' },
});
