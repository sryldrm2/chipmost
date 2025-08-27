import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = { emoji: string; title: string; desc?: string; onPress?: () => void };

export default function CategoryCard({ emoji, title, desc, onPress }: Props) {
  const { colors } = useTheme();
  
  return (
    <Pressable 
      onPress={onPress} 
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
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {!!desc && <Text style={[styles.desc, { color: colors.textSecondary }]}>{desc}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, borderRadius: 16, padding: 14, minHeight: 110,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  emoji: { fontSize: 26, marginBottom: 6 },
  title: { fontSize: 15, fontWeight: '700' },
  desc: { fontSize: 12, marginTop: 2 },
});


