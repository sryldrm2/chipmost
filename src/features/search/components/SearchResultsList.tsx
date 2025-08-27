import React, { useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { SearchStackParamList } from '../../../types/navigation';
import { useSearchFilters } from '../SearchFilterContext';
import SearchResultCard from '../../../screens/search/SearchResultCard';
import type { Product } from '../../../types/product';

type SearchNavigationProp = StackNavigationProp<SearchStackParamList, 'SearchScreen'>;

interface SearchResultsListProps {
  onLoadMore: () => void;
  onRefresh: () => void;
}

export default function SearchResultsList({ onLoadMore, onRefresh }: SearchResultsListProps) {
  const navigation = useNavigation<SearchNavigationProp>();
  const { state } = useSearchFilters();
  const { results, isLoading, error, hasMore } = state;

  const handleResultPress = useCallback((product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  }, [navigation]);

  const renderSearchResult = useCallback(({ item }: { item: Product }) => (
    <SearchResultCard
      id={item.id}
      title={item.name}
      description={item.description || ''}
      category={item.category || ''}
      price={item.price}
      currency={item.currency || 'TRY'}
      inStock={item.inStock || false}
      moq={item.moq}
      onPress={() => handleResultPress(item)}
    />
  ), [handleResultPress]);

  const renderFooter = useCallback(() => {
    if (!hasMore) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {results?.items.length ? 'Tüm sonuçlar gösterildi' : 'Sonuç bulunamadı'}
          </Text>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.footerText}>Yükleniyor...</Text>
        </View>
      );
    }

    return null;
  }, [hasMore, isLoading, results?.items.length]);

  const renderEmptyState = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.emptyStateText}>Aranıyor...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Bir hata oluştu</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!results?.items.length) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
          <Text style={styles.emptyText}>
            Arama kriterlerinize uygun ürün bulunamadı. Farklı anahtar kelimeler deneyin veya filtreleri değiştirin.
          </Text>
        </View>
      );
    }

    return null;
  }, [isLoading, error, results?.items.length, onRefresh]);

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoading) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 120, // Approximate height of each item
    offset: 120 * index,
    index,
  }), []);

  if (!results && !isLoading && !error) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>Arama yapın</Text>
        <Text style={styles.emptyText}>
          Ürün bulmak için yukarıdaki arama kutusunu kullanın veya filtreleri seçin.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={results?.items || []}
      renderItem={renderSearchResult}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      getItemLayout={getItemLayout}
      windowSize={5}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={5}
      onEndReachedThreshold={0.5}
      onEndReached={handleEndReached}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyState}
      refreshControl={
        <RefreshControl
          refreshing={isLoading && results?.items.length === 0}
          onRefresh={onRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: 400, // Ensure empty state has enough space
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
