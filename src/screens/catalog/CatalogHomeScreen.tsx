import React, { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { BackHandler, Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CategorySection from '../../components/CategorySection';
import { CATEGORIES } from '../../data/categories';
import { useTheme } from '../../context/ThemeContext';

export default function CatalogHomeScreen() {
  const nav = useNavigation<any>();
  const [showExitHint, setShowExitHint] = useState(false);
  const lastBack = useRef(0);
  const { colors } = useTheme();

  // Bölümler: Popüler ve Tümü
  const popular = useMemo(() => CATEGORIES.filter(c => c.popular), []);
  const all = useMemo(() => CATEGORIES, []);

  const goCategory = (categoryId: string) =>
    nav.navigate('CategoryDetail', { categoryId, mode: 'subs' }); // sitemap akışı: mode:'subs'

  // Android donanım geri tuşu: çift-bas çıkış + hint
  const onHardwareBack = useCallback(() => {
    if (Platform.OS !== 'android') return false;
    const now = Date.now();
    if (now - lastBack.current < 2000) { BackHandler.exitApp(); return true; }
    lastBack.current = now; setShowExitHint(true);
    setTimeout(() => setShowExitHint(false), 2000);
    return true;
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => sub.remove();
  }, [onHardwareBack]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Chipmost – Katalog</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>Kategori seçerek ürünlere ilerle</Text>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
        scrollEventThrottle={16}
        decelerationRate="normal"
        contentInsetAdjustmentBehavior="automatic"
      >
        <CategorySection title="⭐️ Popüler Kategoriler" items={popular} onPressItem={goCategory} />
        <CategorySection title="📚 Tüm Kategoriler" items={all} onPressItem={goCategory} />
      </ScrollView>

      {Platform.OS === 'android' && showExitHint && (
        <View style={[styles.exitHint, { backgroundColor: colors.text }]}><Text style={[styles.exitHintText, { color: colors.background }]}>Çıkmak için tekrar basın</Text></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 6, marginBottom: 6 },
  exitHint: {
    position: 'absolute', bottom: 24, alignSelf: 'center',
    backgroundColor: '#111', paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 999, elevation: 3,
  },
  exitHintText: { color: '#fff', fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
});


