import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InfoBanner({ text }: { text: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#e7f1ff', padding: 12, borderRadius: 12, alignSelf: 'stretch' },
  text: { color: '#0a58ca', fontWeight: '700', fontSize: 12 },
});
