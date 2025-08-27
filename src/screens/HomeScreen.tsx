import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

type Category = { id: string; title: string; emoji: string; desc: string };

const CATEGORIES: Category[] = [
  { id: 'conn', title: 'Konnektörler', emoji: '🔌', desc: 'Endüstriyel bağlantı çözümleri' },
  { id: 'wire', title: 'Kablolar', emoji: '🧵', desc: 'Sinyal ve güç kabloları' },
  { id: 'acc',  title: 'Aksesuarlar', emoji: '🧰', desc: 'Kelepçe, kelepçe tabancası vb.' },
  { id: 'tool', title: 'Araçlar', emoji: '🛠️', desc: 'Sıkma pensesi, soyucu' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: Category }) => (
    <Pressable
      onPress={() => {
        console.log('🏠 HomeScreen: Kategori tıklandı:', item.id);
        console.log('🎯 Navigation hedefi:', 'Catalog', 'CategoryDetail', { categoryId: item.id, mode: 'subs' });
        
        navigation.navigate('Catalog', {
          screen: 'CategoryDetail',
          params: { categoryId: item.id, mode: 'subs' },
        });
      }}
      style={({ pressed }) => [
        styles.card,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          transform: [{ scale: pressed ? 0.98 : 1 }] 
        },
      ]}
    >
      <Text style={[styles.emoji]}>{item.emoji}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>{item.desc}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Chipmost</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>Kategoriye göz at ve ürüne ilerle</Text>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingVertical: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  sub: { fontSize: 14, color: '#666', marginBottom: 16 },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 120,
  },
  emoji: { fontSize: 28, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  desc: { fontSize: 12, color: '#666' },
});
