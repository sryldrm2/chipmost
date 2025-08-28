import React from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../cart/CartContext';

type RouteParams = { productId?: string };
type Product = { id: string; name: string; desc: string; price: number; category?: string; inStock?: boolean; thumbnail?: string | null };

const MOCK: Record<string, Product> = {
  'p-1': { id: 'p-1', name: 'SMA Erkek Konnektör', desc: 'Altın kaplama, RG316 uyumlu', price: 52.0, category: 'Konnektörler', inStock: true, thumbnail: null },
  'p-2': { id: 'p-2', name: 'MCX Dişi Konnektör', desc: 'RF uygulamaları', price: 15.99, category: 'Konnektörler', inStock: false, thumbnail: null },
  'p-3': { id: 'p-3', name: 'BNC Konnektör', desc: '75Ω video sistemleri', price: 29.9, category: 'Konnektörler', inStock: true, thumbnail: null },
  'p-4': { id: 'p-4', name: 'Makaron 15-25mm', desc: 'Ayarlanabilir kelepçe', price: 8.75, category: 'Aksesuarlar', inStock: true, thumbnail: null },
  'p-5': { id: 'p-5', name: 'Kelepçe Tabancası', desc: 'Profesyonel kullanım', price: 45.50, category: 'Aksesuarlar', inStock: true, thumbnail: null },
  'p-6': { id: 'p-6', name: 'Kablo Soyucu', desc: 'Çok fonksiyonlu', price: 25.00, category: 'Araçlar', inStock: false, thumbnail: null },
  'p-7': { id: 'p-7', name: 'Sıkma Pensesi', desc: 'Endüstriyel kalite', price: 35.99, category: 'Araçlar', inStock: true, thumbnail: null },
  
  // Alt kategoriler için ürünler
  'p-rf-1': { id: 'p-rf-1', name: 'SMA Erkek RF Konnektör', desc: '2.4GHz uyumlu, altın kaplama', price: 75.0, category: 'RF Konnektörler', inStock: true, thumbnail: null },
  'p-rf-2': { id: 'p-rf-2', name: 'BNC Dişi RF Konnektör', desc: '50 ohm, RG58 uyumlu', price: 28.50, category: 'RF Konnektörler', inStock: true, thumbnail: null },
  'p-ind-1': { id: 'p-ind-1', name: 'M12 Erkek Endüstriyel', desc: 'IP67 korumalı, 8 pin', price: 45.0, category: 'Endüstriyel', inStock: false, thumbnail: null },
  'p-ind-2': { id: 'p-ind-2', name: 'M8 Dişi Endüstriyel', desc: 'IP67 korumalı, 4 pin', price: 32.0, category: 'Endüstriyel', inStock: true, thumbnail: null },
  'p-mak-1': { id: 'p-mak-1', name: '15mm Makaron Seti', desc: '10 adet, ayarlanabilir', price: 12.0, category: 'Makaron', inStock: true, thumbnail: null },
  'p-mak-2': { id: 'p-mak-2', name: '25mm Makaron Seti', desc: '10 adet, ayarlanabilir', price: 15.0, category: 'Makaron', inStock: true, thumbnail: null },
  'p-tool-1': { id: 'p-tool-1', name: 'Profesyonel Sıkma Pensesi', desc: '0.08-2.5mm² kablo', price: 85.0, category: 'Pense', inStock: true, thumbnail: null },
  'p-tool-2': { id: 'p-tool-2', name: 'Kablo Soyucu Seti', desc: '6 farklı boyut', price: 45.0, category: 'Soyucu', inStock: false, thumbnail: null },
  
  // Daha derin kategoriler için ürünler
  'p-sma-1': { id: 'p-sma-1', name: 'SMA Erkek 50Ω', desc: 'RG58/RG59 uyumlu, altın kaplama', price: 85.0, category: 'SMA Konnektörler', inStock: true, thumbnail: null },
  'p-sma-2': { id: 'p-sma-2', name: 'SMA Dişi 50Ω', desc: 'RG58/RG59 uyumlu, altın kaplama', price: 78.0, category: 'SMA Konnektörler', inStock: false, thumbnail: null },
  'p-bnc-1': { id: 'p-bnc-1', name: 'BNC Erkek 75Ω', desc: 'Video sistemleri, RG59 uyumlu', price: 32.0, category: 'BNC Konnektörler', inStock: true, thumbnail: null },
  'p-bnc-2': { id: 'p-bnc-2', name: 'BNC Dişi 75Ω', desc: 'Video sistemleri, RG59 uyumlu', price: 28.0, category: 'BNC Konnektörler', inStock: true, thumbnail: null },
  'p-m12-1': { id: 'p-m12-1', name: 'M12 Erkek 8 Pin', desc: 'IP67 korumalı, endüstriyel', price: 65.0, category: 'M12 Konnektörler', inStock: true, thumbnail: null },
  'p-m12-2': { id: 'p-m12-2', name: 'M12 Dişi 8 Pin', desc: 'IP67 korumalı, endüstriyel', price: 58.0, category: 'M12 Konnektörler', inStock: false, thumbnail: null },
  'p-m8-1': { id: 'p-m8-1', name: 'M8 Erkek 4 Pin', desc: 'IP67 korumalı, endüstriyel', price: 42.0, category: 'M8 Konnektörler', inStock: true, thumbnail: null },
  'p-m8-2': { id: 'p-m8-2', name: 'M8 Dişi 4 Pin', desc: 'IP67 korumalı, endüstriyel', price: 38.0, category: 'M8 Konnektörler', inStock: true, thumbnail: null },
  'p-mak15-1': { id: 'p-mak15-1', name: '15mm Makaron Seti', desc: '10 adet, ayarlanabilir', price: 12.0, category: '15mm Makaron', inStock: true, thumbnail: null },
  'p-mak25-1': { id: 'p-mak25-1', name: '25mm Makaron Seti', desc: '10 adet, ayarlanabilir', price: 15.0, category: '25mm Makaron', inStock: true, thumbnail: null },
  'p-crimp-1': { id: 'p-crimp-1', name: 'Profesyonel Sıkma Pensesi', desc: '0.08-2.5mm² kablo', price: 85.0, category: 'Sıkma Pensesi', inStock: true, thumbnail: null },
  'p-strip-1': { id: 'p-strip-1', name: 'Kablo Soyucu Seti', desc: '6 farklı boyut', price: 45.0, category: 'Soyucu Pense', inStock: false, thumbnail: null },
};

function tl(v: number) { return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(v); }

export default function ProductDetailScreen() {
  const nav = useNavigation<any>();
  const { params } = useRoute<any>();
  const { colors } = useTheme();
  const { productId } = (params as RouteParams) || {};
  const { addItem } = useCart();

  // Deep Link Guard: productId yok/boş → güvenli fallback
  React.useEffect(() => {
    if (!productId || productId.trim() === '') {
      Alert.alert('Geçersiz bağlantı', 'Ürün kimliği bulunamadı.', [
        { text: 'Kataloğa Dön', onPress: () => nav.reset({ index: 0, routes: [{ name: 'CatalogHome' }] }) },
      ]);
    }
  }, [productId, nav]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [item, setItem] = React.useState<Product | null>(null);
  const [fav, setFav] = React.useState(false);

  const load = React.useCallback(() => {
    if (!productId) return;
    setLoading(true); setError(null);
    const t = setTimeout(() => {
      try {
        if (!(productId in MOCK)) { setItem(null); }
        else { setItem(MOCK[productId]); }
      } catch (e: any) {
        setError(e.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }, 700);
    return () => clearTimeout(t);
  }, [productId]);

  React.useEffect(() => { load(); }, [load]);

  // --- UI states ---
  if (!productId || productId.trim() === '') {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.err, { color: colors.error }]}>Geçersiz bağlantı</Text>
      </View>
    ); // Deep Link Guard (invalid id)
  }
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
        <Text style={[styles.muted, { color: colors.textSecondary }]}>Ürün yükleniyor...</Text>
      </View>
    ); // Loading
  }
  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.err, { color: colors.error }]}>{error}</Text>
        <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={load}>
          <Text style={[styles.btnText, { color: colors.buttonText }]}>Tekrar Dene</Text>
        </Pressable>
      </View>
    ); // Error
  }
  if (!item) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.muted, { color: colors.textSecondary }]}>Ürün bulunamadı</Text>
        <Pressable
          style={[styles.btn, styles.secondary, { backgroundColor: colors.primaryLight }]}
          onPress={() => nav.reset({ index: 0, routes: [{ name: 'CatalogHome' }] })}
        >
          <Text style={[styles.secondaryText, { color: colors.primary }]}>Kataloğa Dön</Text>
        </Pressable>
      </View>
    ); // Not Found
  }

  const addToCart = () => {
    console.log('🛒 addToCart çağrıldı, item:', item);
    console.log('📦 Stok durumu:', item.inStock);
    
    // Stok kontrolü
    if (!item.inStock) {
      console.log('❌ Stokta olmayan ürün, Alert gösteriliyor');
      Alert.alert(
        'Stok Hatası', 
        'Bu ürün stokta bulunmuyor. Lütfen stokta olan bir ürün seçin.',
        [{ text: 'Tamam', style: 'default' }]
      );
      return;
    }

    console.log('✅ Stokta olan ürün, sepete ekleniyor');
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      thumbnail: item.thumbnail ?? null,
      inStock: item.inStock,
    }, 1);
    Alert.alert('Sepete Eklendi', `"${item.name}" sepete eklendi.`);
  };
  const share = () => Alert.alert('Paylaş', 'Paylaşım bağlantısı kopyalandı: chipmost://product/' + item.id);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      {/* Görsel */}
      <View style={[styles.hero, { backgroundColor: colors.surface }]}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.heroImg} />
        ) : (
          <View style={styles.heroPlaceholder}><Text style={{ fontSize: 48 }}>📦</Text></View>
        )}
      </View>

      {/* Üst Bilgi */}
      <View style={styles.row}>
        {!!item.category && (
          <Text style={[styles.chip, { 
            color: colors.primary, 
            backgroundColor: colors.primaryLight 
          }]}>{item.category}</Text>
        )}
        <Text style={[styles.price, { color: colors.success }]}>{tl(item.price)}</Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>{item.desc}</Text>
      <Text style={[
        styles.stock, 
        item.inStock ? { color: colors.success } : { color: colors.error }
      ]}>
        {item.inStock ? '✓ Stokta' : '✗ Stok Yok'}
      </Text>

      {/* Aksiyonlar */}
      <View style={styles.actions}>
        <Pressable 
          style={[
            styles.actBtn, 
            { borderColor: colors.border },
            item.inStock ? { backgroundColor: colors.primary, borderColor: colors.primary } : { backgroundColor: colors.surface, borderColor: colors.border }
          ]} 
          onPress={addToCart}
          disabled={!item.inStock}
        >
          <Text style={[
            item.inStock ? { color: colors.buttonText, fontWeight: '800' } : { color: colors.textSecondary, fontWeight: '700' }
          ]}>
            {item.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
          </Text>
        </Pressable>
        <Pressable style={[styles.actBtn, { borderColor: colors.border }]} onPress={() => setFav((x) => !x)}>
          <Text style={[styles.actText, { color: colors.text }]}>{fav ? '★ Favoride' : '☆ Favori'}</Text>
        </Pressable>
        <Pressable style={[styles.actBtn, { borderColor: colors.border }]} onPress={share}>
          <Text style={[styles.actText, { color: colors.text }]}>Paylaş</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  muted: { fontWeight: '500' },
  err: { fontWeight: '700' },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  btnText: { fontWeight: '700' },
  secondary: { backgroundColor: 'transparent' },
  secondaryText: { fontWeight: '700' },

  hero: { height: 220, borderRadius: 16, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%' },
  heroPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chip: { fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  price: { marginLeft: 'auto', fontSize: 18, fontWeight: '800' },

  title: { fontSize: 20, fontWeight: '800' },
  desc: { fontSize: 13 },
  stock: { fontSize: 12, fontWeight: '700', marginTop: 2 },

  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actBtn: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  primary: { },
  disabled: { },
  actText: { fontWeight: '700' },
  actTextPrimary: { fontWeight: '800' },
  actTextDisabled: { fontWeight: '700' },
});
