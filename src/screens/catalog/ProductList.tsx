import React from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProductCard from '../../components/ProductCard';
import { tl } from '../../utils/money';
import { useTheme } from '../../context/ThemeContext';

type RouteParams = { categoryId: string };
type Product = { id: string; name: string; desc: string; price: number; category?: string; inStock?: boolean; thumbnail?: string | null };

const MOCK: Record<string, Product[]> = {
  // Ana kategoriler
  conn: [
    { id: 'p-1', name: 'SMA Erkek Konnektör', desc: 'Altın kaplama, RG316 uyumlu', price: 52.0, category: 'Konnektörler', inStock: true, thumbnail: null },
    { id: 'p-2', name: 'MCX Dişi Konnektör', desc: 'RF uygulamaları', price: 15.99, category: 'Konnektörler', inStock: false, thumbnail: null },
    { id: 'p-3', name: 'BNC Konnektör', desc: '75Ω video sistemleri', price: 29.9, category: 'Konnektörler', inStock: true, thumbnail: null },
  ],
  wire: [], // Empty state'i göstermek için
  acc: [
    { id: 'p-4', name: 'Makaron 15-25mm', desc: 'Ayarlanabilir kelepçe', price: 8.75, category: 'Aksesuarlar', inStock: true, thumbnail: null },
    { id: 'p-5', name: 'Kelepçe Tabancası', desc: 'Profesyonel kullanım', price: 45.50, category: 'Aksesuarlar', inStock: true, thumbnail: null },
  ],
  tool: [
    { id: 'p-6', name: 'Kablo Soyucu', desc: 'Çok fonksiyonlu', price: 25.00, category: 'Araçlar', inStock: false, thumbnail: null },
    { id: 'p-7', name: 'Sıkma Pensesi', desc: 'Endüstriyel kalite', price: 35.99, category: 'Araçlar', inStock: true, thumbnail: null },
  ],
  
  // Alt kategoriler için ürünler
  'conn-rf': [
    { id: 'p-rf-1', name: 'SMA Erkek RF Konnektör', desc: '2.4GHz uyumlu, altın kaplama', price: 75.0, category: 'RF Konnektörler', inStock: true, thumbnail: null },
    { id: 'p-rf-2', name: 'BNC Dişi RF Konnektör', desc: '50 ohm, RG58 uyumlu', price: 28.50, category: 'RF Konnektörler', inStock: true, thumbnail: null },
  ],
  'conn-ind': [
    { id: 'p-ind-1', name: 'M12 Erkek Endüstriyel', desc: 'IP67 korumalı, 8 pin', price: 45.0, category: 'Endüstriyel', inStock: false, thumbnail: null },
    { id: 'p-ind-2', name: 'M8 Dişi Endüstriyel', desc: 'IP67 korumalı, 4 pin', price: 32.0, category: 'Endüstriyel', inStock: true, thumbnail: null },
  ],
  'acc-makaron': [
    { id: 'p-mak-1', name: '15mm Makaron Seti', desc: '10 adet, ayarlanabilir', price: 12.0, category: 'Makaron', inStock: true, thumbnail: null },
    { id: 'p-mak-2', name: '25mm Makaron Seti', desc: '10 adet, ayarlanabilir', price: 15.0, category: 'Makaron', inStock: true, thumbnail: null },
  ],
  'tool-pliers': [
    { id: 'p-tool-1', name: 'Profesyonel Sıkma Pensesi', desc: '0.08-2.5mm² kablo', price: 85.0, category: 'Pense', inStock: true, thumbnail: null },
    { id: 'p-tool-2', name: 'Kablo Soyucu Seti', desc: '6 farklı boyut', price: 45.0, category: 'Soyucu', inStock: false, thumbnail: null },
  ],
  
  // Daha derin kategoriler için ürünler
  'conn-rf-sma': [
    { id: 'p-sma-1', name: 'SMA Erkek 50Ω', desc: 'RG58/RG59 uyumlu, altın kaplama', price: 85.0, category: 'SMA Konnektörler', inStock: true, thumbnail: null },
    { id: 'p-sma-2', name: 'SMA Dişi 50Ω', desc: 'RG58/RG59 uyumlu, altın kaplama', price: 78.0, category: 'SMA Konnektörler', inStock: false, thumbnail: null },
  ],
  'conn-rf-bnc': [
    { id: 'p-bnc-1', name: 'BNC Erkek 75Ω', desc: 'Video sistemleri, RG59 uyumlu', price: 32.0, category: 'BNC Konnektörler', inStock: true, thumbnail: null },
    { id: 'p-bnc-2', name: 'BNC Dişi 75Ω', desc: 'Video sistemleri, RG59 uyumlu', price: 28.0, category: 'BNC Konnektörler', inStock: true, thumbnail: null },
  ],
  'conn-ind-m12': [
    { id: 'p-m12-1', name: 'M12 Erkek 8 Pin', desc: 'IP67 korumalı, endüstriyel', price: 65.0, category: 'M12 Konnektörler', inStock: true, thumbnail: null },
    { id: 'p-m12-2', name: 'M12 Dişi 8 Pin', desc: 'IP67 korumalı, endüstriyel', price: 58.0, category: 'M12 Konnektörler', inStock: false, thumbnail: null },
  ],
  'conn-ind-m8': [
    { id: 'p-m8-1', name: 'M8 Erkek 4 Pin', desc: 'IP67 korumalı, endüstriyel', price: 42.0, category: 'M8 Konnektörler', inStock: true, thumbnail: null },
    { id: 'p-m8-2', name: 'M8 Dişi 4 Pin', desc: 'IP67 korumalı, endüstriyel', price: 38.0, category: 'M8 Konnektörler', inStock: true, thumbnail: null },
  ],
  'acc-makaron-15': [
    { id: 'p-mak15-1', name: '15mm Makaron Seti', desc: '10 adet, ayarlanabilir', price: 12.0, category: '15mm Makaron', inStock: true, thumbnail: null },
  ],
  'acc-makaron-25': [
    { id: 'p-mak25-1', name: '25mm Makaron Seti', desc: '10 adet, ayarlanabilir', price: 15.0, category: '25mm Makaron', inStock: true, thumbnail: null },
  ],
  'tool-pliers-crimp': [
    { id: 'p-crimp-1', name: 'Profesyonel Sıkma Pensesi', desc: '0.08-2.5mm² kablo', price: 85.0, category: 'Sıkma Pensesi', inStock: true, thumbnail: null },
  ],
  'tool-pliers-strip': [
    { id: 'p-strip-1', name: 'Kablo Soyucu Seti', desc: '6 farklı boyut', price: 45.0, category: 'Soyucu Pense', inStock: false, thumbnail: null },
  ],
};

type SortKey = 'relevance' | 'priceAsc' | 'priceDesc' | 'nameAsc';

export default function ProductList() {
  const nav = useNavigation<any>();
  const { params } = useRoute<any>();
  const { categoryId } = (params as RouteParams) || { categoryId: '' };
  const { colors } = useTheme();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<Product[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [sort, setSort] = React.useState<SortKey>('relevance');

  const load = React.useCallback(() => {
    setLoading(true); 
    setError(null);
    const t = setTimeout(() => {
      try {
        if (!(categoryId in MOCK)) throw new Error('Bağlantı sorunu');
        setData(MOCK[categoryId]);
      } catch (e: any) {
        setError(e.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [categoryId]);

  React.useEffect(() => load(), [load]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => { load(); setRefreshing(false); }, 700);
  }, [load]);

  const sorted = React.useMemo(() => {
    const items = [...data];
    switch (sort) {
      case 'priceAsc':  return items.sort((a, b) => a.price - b.price);
      case 'priceDesc': return items.sort((a, b) => b.price - a.price);
      case 'nameAsc':   return items.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      default:          return items; // relevance (mock)
    }
  }, [data, sort]);

  // --- UI states ---
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
        <Text style={[styles.muted, { color: colors.textSecondary }]}>Ürünler yükleniyor…</Text>
      </View>
    ); // Loading  (UX CILA)
  }
  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.err, { color: colors.error }]}>{error}</Text>
        <Pressable style={[styles.btn, { backgroundColor: colors.buttonPrimary }]} onPress={load}><Text style={[styles.btnText, { color: colors.buttonText }]}>Tekrar dene</Text></Pressable>
      </View>
    ); // Error  (UX CILA)
  }
  if (!sorted.length) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.muted, { color: colors.textSecondary }]}>Bu kategoride ürün yok</Text>
        <Pressable
          style={[styles.btn, styles.secondary, { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 1 }]}
          onPress={() => nav.reset({ index: 0, routes: [{ name: 'CatalogHome' }] })}
        >
          <Text style={[styles.secondaryText, { color: colors.primary }]}>Kataloğa Dön</Text>
        </Pressable>
      </View>
    ); // Empty  (UX CILA)
  }

  return (
    <FlatList
      data={sorted}
      keyExtractor={(x) => x.id}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={[styles.hTitle, { color: colors.text }]}>Chipmost – Ürünler</Text>
          <View style={styles.hRow}>
            <Text style={[styles.badge, { color: colors.primary, backgroundColor: colors.surface }]}>{sorted.length} ürün</Text>
            <Text style={[styles.hHint, { color: colors.textSecondary }]}>Sırala:</Text>
            {(['relevance', 'priceAsc', 'priceDesc', 'nameAsc'] as SortKey[]).map((k) => (
              <Pressable key={k} onPress={() => setSort(k)} style={[
                styles.pill, 
                { borderColor: colors.border },
                sort === k && { backgroundColor: colors.primary + '22', borderColor: colors.primary }
              ]}>
                <Text style={[
                  styles.pillText, 
                  { color: colors.text },
                  sort === k && { color: colors.primary, fontWeight: '700' }
                ]}>
                  {k === 'relevance' ? 'Uygunluk' : k === 'priceAsc' ? `Fiyat ↑` : k === 'priceDesc' ? `Fiyat ↓` : 'Ad A→Z'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <ProductCard
          id={item.id}
          name={item.name}
          desc={item.desc}
          price={item.price}
          category={item.category}
          inStock={item.inStock}
          thumbnail={item.thumbnail}
          onPress={(id) => nav.navigate('ProductDetail', { productId: id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  muted: { },
  err: { fontWeight: '700' },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  btnText: { fontWeight: '700' },
  secondary: { },
  secondaryText: { fontWeight: '700' },

  header: { marginBottom: 12 },
  hTitle: { fontSize: 20, fontWeight: '800' },
  hRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  badge: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  hHint: { fontSize: 12, marginLeft: 6 },
  pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  pillActive: { },
  pillText: { fontSize: 12 },
  pillActiveText: { fontWeight: '700' },
});
