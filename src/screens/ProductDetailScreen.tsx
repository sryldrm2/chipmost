import React from 'react';
import { View, Text, Image, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '../navigation/SearchStack';
import { getProductById } from '../data/products';
import { useCart } from '../cart/CartContext';
import { format } from '../utils/currency';

export default function ProductDetailScreen() {
  const route = useRoute<RouteProp<SearchStackParamList, 'ProductDetail'>>();
  const { productId } = route.params;
  const product = getProductById(productId);

  const { addItem } = useCart();

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ürün bulunamadı</Text>
        <Text style={styles.errorSubtext}>Ürün ID: {productId}</Text>
        <Text style={styles.errorHelp}>Lütfen arama sayfasına geri dönün ve farklı bir ürün seçin.</Text>
      </View>
    );
  }

  const onAddToCart = () => {
    // MOQ kontrolü - minimum sipariş miktarını sağla
    const qty = Math.max(1, product.moq ?? 1);
    
    addItem({ 
      id: product.id, 
      name: product.name, 
      unitPrice: product.price, 
      currency: product.currency || 'TRY',
      moq: product.moq,
      thumbnail: product.imageUrl,
      inStock: product.inStock ?? false
    }, qty);
    
    Alert.alert(
      'Başarılı!', 
      `${product.name} sepete eklendi.${product.moq && product.moq > 1 ? ` (${qty} adet - minimum sipariş)` : ''}`,
      [{ text: 'Tamam', style: 'default' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Ürün Resmi */}
      {product.imageUrl ? (
        <Image 
          source={{ uri: product.imageUrl }} 
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Resim Yok</Text>
        </View>
      )}

      {/* Ürün Bilgileri */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        
        {product.category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        )}

        {/* Fiyat ve Stok */}
        <View style={styles.priceStockContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              {format(product.price, product.currency || 'TRY')}
            </Text>
            {product.currency && product.currency !== 'TRY' && (
              <Text style={styles.priceSubtext}>
                ≈ {format(product.price, 'TRY')} (yaklaşık)
              </Text>
            )}
          </View>
          
          <View style={styles.stockContainer}>
            <View style={[
              styles.stockIndicator, 
              { backgroundColor: product.inStock ? '#10b981' : '#ef4444' }
            ]} />
            <Text style={[
              styles.stockText, 
              { color: product.inStock ? '#10b981' : '#ef4444' }
            ]}>
              {product.inStock 
                ? `Stokta • ${product.stockQty ?? 0} adet` 
                : 'Stokta yok'
              }
            </Text>
          </View>
        </View>

        {/* MOQ Bilgisi */}
        {product.moq && product.moq > 1 && (
          <View style={styles.moqContainer}>
            <Text style={styles.moqLabel}>📦 Minimum Sipariş:</Text>
            <Text style={styles.moqText}>{product.moq} adet</Text>
          </View>
        )}

        {/* MPN */}
        {product.mpn && (
          <View style={styles.mpnContainer}>
            <Text style={styles.mpnLabel}>MPN:</Text>
            <Text style={styles.mpnText}>{product.mpn}</Text>
          </View>
        )}

        {/* Açıklama */}
        {product.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Ürün Açıklaması</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        )}
      </View>

      {/* Sepete Ekle Butonu */}
      <Pressable 
        style={[
          styles.addToCartButton,
          !product.inStock && styles.addToCartButtonDisabled
        ]}
        onPress={onAddToCart}
        disabled={!product.inStock}
      >
        <Text style={styles.addToCartButtonText}>
          {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
        </Text>
        {product.inStock && product.moq && product.moq > 1 && (
          <Text style={styles.addToCartSubtext}>
            Minimum sipariş: {product.moq} adet
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  errorHelp: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  productInfo: {
    marginBottom: 24,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 32,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceContainer: {
    flex: 1,
  },
  priceText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10b981',
    marginBottom: 4,
  },
  priceSubtext: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '500',
  },
  moqContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  moqLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400e',
  },
  moqText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  mpnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mpnLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  mpnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  addToCartSubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
});
