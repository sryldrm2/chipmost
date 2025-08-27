import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { tl } from '../utils/money';
import { useTheme } from '../context/ThemeContext';

type Props = {
  id: string;
  name: string;
  desc?: string;
  price: number;
  category?: string;
  inStock?: boolean;
  onPress?: (id: string) => void;
  thumbnail?: string | null;
};

export default function ProductCard({ id, name, desc, price, category, inStock = true, onPress, thumbnail }: Props) {
  const { colors } = useTheme();
  
  return (
    <Pressable 
      onPress={() => onPress?.(id)} 
      style={({ pressed }) => [
        styles.card, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          transform: [{ scale: pressed ? 0.98 : 1 }] 
        }
      ]}
    >
      <View style={styles.row}>
        <View style={styles.thumbWrap}>
          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumbPlaceholder, { backgroundColor: colors.surface }]}><Text style={{ fontSize: 20 }}>📦</Text></View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            {!!category && <Text style={[styles.chip, { color: colors.primary, backgroundColor: colors.surface }]}>{category}</Text>}
            <Text style={[styles.price, { color: colors.success }]}>{tl(price)}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{name}</Text>
          {!!desc && <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>{desc}</Text>}
          <Text style={[
            styles.stock, 
            { color: inStock ? colors.success : colors.error }
          ]}>
            {inStock ? '✓ Stokta' : '✗ Stok Yok'}
          </Text>
          <Text style={[styles.link, { color: colors.primary }]}>Detay →</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 12, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  thumbWrap: { width: 64, height: 64, marginRight: 12 },
  thumb: { width: '100%', height: '100%', borderRadius: 10 },
  thumbPlaceholder: { width: '100%', height: '100%', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  chip: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  price: { marginLeft: 'auto', fontSize: 14, fontWeight: '700' },
  name: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  desc: { fontSize: 12, marginTop: 2 },
  stock: { fontSize: 12, marginTop: 6, fontWeight: '600' },
  stockOk: { },
  stockNo: { },
  link: { fontSize: 12, marginTop: 6, fontWeight: '600' },
});
