import React from 'react';
import { View, Text, Image, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { SearchStackParamList } from '../../types/navigation';
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
