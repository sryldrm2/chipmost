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
import type { SearchStackParamList } from '../../../navigation/SearchStack';
import { useSearchFilters } from '../SearchFilterContext';
import { useTheme } from '../../../context/ThemeContext';
import SearchResultCard from '../../../screens/search/SearchResultCard';
import type { Product } from '../../../types/product';

type SearchNavigationProp = StackNavigationProp<SearchStackParamList, 'SearchScreen'>;

interface SearchResultsListProps {
  onLoadMore: () => void;
  onRefresh: () => void;
}

export default function SearchResultsList({ onLoadMore, onRefresh }: SearchResultsListProps) {
  const navigation = useNavigation<SearchNavigationProp>();
  const { colors } = useTheme();
  const { state } = useSearchFilters();
  const { results, isLoading, error, hasMore } = state;

  const handleResultPress = useCallback((product: Product) => {
    console.log('Navigating to ProductDetail with ID:', product.id);
    console.log('Navigation state:', JSON.stringify(navigation.getState(), null, 2));
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
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {results?.items.length ? 'Tüm sonuçlar gösterildi' : 'Sonuç bulunamadı'}
          </Text>
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Yükleniyor...</Text>
        </View>
      );
    }

    return null;
  }, [hasMore, isLoading, results?.items.length, colors]);

  const renderEmptyState = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Aranıyor...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: colors.error }]}>Bir hata oluştu</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={onRefresh}>
            <Text style={[styles.retryButtonText, { color: colors.buttonText }]}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!results?.items.length) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Sonuç bulunamadı</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Arama kriterlerinize uygun ürün bulunamadı. Farklı anahtar kelimeler deneyin veya filtreleri değiştirin.
          </Text>
        </View>
      );
    }

    return null;
  }, [isLoading, error, results?.items.length, onRefresh, colors]);

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
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Arama yapın</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
          colors={[colors.primary]}
          tintColor={colors.primary}
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
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
