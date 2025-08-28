import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SupplierResult } from '../types/partSearch';
import SearchResultCard from '../screens/search/SearchResultCard';

type Props = {
  results: SupplierResult[];
  isLoading: boolean;
  searchTime: number;
  onProductPress: (productId: string) => void;
};

export default function SearchResults({ results, isLoading, searchTime, onProductPress }: Props) {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Arama yapılıyor...
        </Text>
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Arama sonucu bulunamadı
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
          Farklı anahtar kelimeler deneyin
        </Text>
      </View>
    );
  }

  const renderSupplierResults = ({ item }: { item: SupplierResult }) => (
    <View style={styles.supplierSection}>
      <View style={styles.supplierHeader}>
        <Text style={[styles.supplierName, { color: colors.text }]}>
          {item.supplierName}
        </Text>
        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
          {item.results.length} sonuç
        </Text>
      </View>
      
      <FlatList
        data={item.results}
        keyExtractor={(result) => result.id}
        renderItem={({ item: result }) => (
          <SearchResultCard
            id={result.id}
            title={result.name}
            description={result.description}
            price={result.price}
            currency={result.currency}
            inStock={result.inStock}
            stockQty={result.stockQty}
            category={result.category}
            mpn={result.mpn}
            imageUrl={result.imageUrl}
            moq={result.moq}
            onPress={() => onProductPress(result.id)}
          />
        )}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {searchTime > 0 && (
        <View style={styles.searchInfo}>
          <Text style={[styles.searchTime, { color: colors.textSecondary }]}>
            {results.length} sonuç {searchTime}ms'de bulundu
          </Text>
        </View>
      )}
      
      <FlatList
        data={results}
        keyExtractor={(item) => item.supplierName}
        renderItem={renderSupplierResults}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  searchInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  searchTime: {
    fontSize: 14,
    textAlign: 'center',
  },
  resultsList: {
    padding: 16,
  },
  supplierSection: {
    marginBottom: 24,
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: '700',
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '500',
  },
});


