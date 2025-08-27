import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SearchResultCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  inStock: boolean;
  onPress: () => void;
}

export default function SearchResultCard({ 
  id, 
  title, 
  description, 
  category, 
  price,
  inStock,
  onPress 
}: SearchResultCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.category}>{category}</Text>
          <Text style={[styles.stockStatus, { color: inStock ? '#28a745' : '#dc3545' }]}>
            {inStock ? '✓ Stokta' : '✗ Stok Yok'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.description}>{description}</Text>
      
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.id}>ID: {id}</Text>
          <Text style={styles.price}>₺{price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={onPress}
        >
          <Text style={styles.detailButtonText}>Detaya Git</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  stockStatus: {
    fontSize: 11,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flex: 1,
  },
  id: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#28a745',
  },
  detailButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
