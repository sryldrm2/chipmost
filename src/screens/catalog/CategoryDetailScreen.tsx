import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import InfoBanner from '../../components/InfoBanner';

type Mode = 'subs' | 'products';
type Subcat = { id: string; title: string; emoji?: string };

type RouteParams = { categoryId: string; mode?: Mode };

// --- MOCK API ---
const DB: Record<string, Subcat[]> = {
  // Ana kategoriler
  conn: [
    { id: 'conn-rf', title: 'RF Konnektörler', emoji: '📡' },
    { id: 'conn-ind', title: 'Endüstriyel', emoji: '🏭' },
  ],
  wire: [], // boş: products fallback'ı tetiklemek için
  acc: [{ id: 'acc-makaron', title: 'Makaron', emoji: '🧵' }],
  tool: [{ id: 'tool-pliers', title: 'Pense', emoji: '🛠️' }],
  
  // Alt kategoriler (derinleşme için)
  'conn-rf': [
    { id: 'conn-rf-sma', title: 'SMA Konnektörler', emoji: '🔌' },
    { id: 'conn-rf-bnc', title: 'BNC Konnektörler', emoji: '📡' },
  ],
  'conn-ind': [
    { id: 'conn-ind-m12', title: 'M12 Konnektörler', emoji: '🏭' },
    { id: 'conn-ind-m8', title: 'M8 Konnektörler', emoji: '⚙️' },
  ],
  'acc-makaron': [
    { id: 'acc-makaron-15', title: '15mm Makaron', emoji: '🧵' },
    { id: 'acc-makaron-25', title: '25mm Makaron', emoji: '🧵' },
  ],
  'tool-pliers': [
    { id: 'tool-pliers-crimp', title: 'Sıkma Pensesi', emoji: '🛠️' },
    { id: 'tool-pliers-strip', title: 'Soyucu Pense', emoji: '✂️' },
  ],
  
  // Daha derin kategoriler (products fallback için boş array)
  'conn-rf-sma': [], // Boş: products fallback'ı tetiklemek için
  'conn-rf-bnc': [], // Boş: products fallback'ı tetiklemek için
  'conn-ind-m12': [], // Boş: products fallback'ı tetiklemek için
  'conn-ind-m8': [], // Boş: products fallback'ı tetiklemek için
  'acc-makaron-15': [], // Boş: products fallback'ı tetiklemek için
  'acc-makaron-25': [], // Boş: products fallback'ı tetiklemek için
  'tool-pliers-crimp': [], // Boş: products fallback'ı tetiklemek için
  'tool-pliers-strip': [], // Boş: products fallback'ı tetiklemek için
};

function fetchSubcategoriesMock(categoryId: string): Promise<Subcat[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // basit hata simülasyonu: bilinmeyen ID'de hata ver
      if (!(categoryId in DB)) return reject(new Error('Kategori bulunamadı'));
      resolve(DB[categoryId]);
    }, 800);
  });
}

// products moduna girerken kullanıcıya bilgi mesajı göster
function ProductsTransition({ categoryId }: { categoryId: string }) {
  const nav = useNavigation<any>();
  const { colors } = useTheme();
  
  React.useEffect(() => {
    // 100ms sonra ProductList'e replace (stack şişmez) - Akış A
    const t = setTimeout(() => {
      nav.replace('ProductList', { categoryId });
    }, 100);
    return () => clearTimeout(t);
  }, [categoryId]);

  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <InfoBanner text="Alt kategori bulunamadı, ürünler listeleniyor…" />
    </View>
  );
}

export default function CategoryDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const { categoryId, mode: initialMode }: RouteParams = route.params ?? {};
  const [mode, setMode] = useState<Mode>(initialMode ?? 'subs');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Subcat[]>([]);
  const lastIdRef = useRef<string | null>(null); // derinleşme guard

  // Scroll to top ref (UX)
  const listRef = useRef<FlatList<Subcat>>(null);

  const title = useMemo(() => `Kategori • ${categoryId}`, [categoryId]);

  // === DEBUG: Console'a yazdır ===
  console.log('🔍 DEBUG CategoryDetailScreen:');
  console.log('📱 Gelen categoryId:', categoryId);
  console.log('🗄️ DB\'deki mevcut key\'ler:', Object.keys(DB));
  console.log('🔍 categoryId DB\'de var mı?', categoryId in DB);
  console.log('📊 DB[categoryId]:', DB[categoryId]);

  // === Core loader ===
  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const subs = await fetchSubcategoriesMock(categoryId);
      setItems(subs);
      // Akıllı mode: subs yoksa products
      setMode(subs.length > 0 ? 'subs' : 'products');
    } catch (e: any) {
      setError(e.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  // useFocusEffect: ekrana her odaklanıldığında çalışır
  useFocusEffect(
    useCallback(() => {
      // Derinleşme guard: aynı kategori ise yeniden işlem yapma
      if (lastIdRef.current === categoryId) return;
      lastIdRef.current = categoryId;
      load();
      // Scroll to top
      setTimeout(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }), 0);
    }, [categoryId, load])
  );

  const onRetry = () => load();
  const goBackSafe = () => (nav.canGoBack() ? nav.goBack() : nav.reset({ index: 0, routes: [{ name: 'CatalogHome' }] }));

  const renderItem = ({ item }: { item: Subcat }) => (
    <Pressable
      onPress={() => {
        // Alt kategori → aynı ekrana replace (derinleşme)
        nav.replace('CategoryDetail', { categoryId: item.id, mode: 'subs' });
      }}
      style={({ pressed }) => [styles.card, { 
        backgroundColor: colors.surface,
        transform: [{ scale: pressed ? 0.98 : 1 }] 
      }]}
    >
      <Text style={styles.emoji}>{item.emoji || '📦'}</Text>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
    </Pressable>
  );

  // --- UI STATES ---
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
        <Text style={[styles.muted, { color: colors.textSecondary }]}>Yükleniyor...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.err, { color: colors.error }]}>Hata: {error}</Text>
        <Pressable onPress={onRetry} style={[styles.btn, { backgroundColor: colors.primary }]}>
          <Text style={[styles.btnText, { color: colors.buttonText }]}>Tekrar Dene</Text>
        </Pressable>
        <Pressable onPress={goBackSafe} style={[styles.btn, styles.secondary, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.secondaryText, { color: colors.primary }]}>Kataloğa Dön</Text>
        </Pressable>
      </View>
    );
  }
  
  // products moduna geçilecekse (empty) kullanıcıya kısa bilgi
  if (mode === 'products') {
    return <ProductsTransition categoryId={categoryId} />;
  }

  // subs modu (liste)
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.badge, { 
        color: colors.primary, 
        backgroundColor: colors.primaryLight 
      }]}>{items.length} alt kategori</Text>
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', paddingHorizontal: 16, paddingTop: 16 },
  badge: { marginTop: 6, marginLeft: 16, alignSelf: 'flex-start', fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  card: { flex: 1, borderRadius: 16, padding: 14, minHeight: 110, marginBottom: 12 },
  emoji: { fontSize: 24, marginBottom: 6 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  muted: { fontWeight: '500' },
  err: { fontWeight: '700' },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  btnText: { fontWeight: '700' },
  secondary: { backgroundColor: 'transparent' },
  secondaryText: { fontWeight: '700' },
});
