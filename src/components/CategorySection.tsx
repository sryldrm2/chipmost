import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CategoryCard from './CategoryCard';
import { useTheme } from '../context/ThemeContext';

type Item = { id: string; title: string; emoji: string; desc?: string };
type Props = { title: string; items: Item[]; onPressItem: (id: string) => void };

export default function CategorySection({ title, items, onPressItem }: Props) {
  const { colors } = useTheme();
  
  return (
    <View style={styles.box}>
      <Text style={[styles.header, { color: colors.text }]}>{title}</Text>
      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginBottom: 12 }}>
            <CategoryCard emoji={item.emoji} title={item.title} desc={item.desc} onPress={() => onPressItem(item.id)} />
          </View>
        )}
        columnWrapperStyle={{ gap: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: 12 },
  header: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
});


