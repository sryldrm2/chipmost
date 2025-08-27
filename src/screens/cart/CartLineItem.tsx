import React, { useState, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../cart/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { convert, format } from '../../utils/currency';

interface CartLineItemProps {
  item: {
    id: string;
    name: string;
    supplier?: string;
    unitPrice: number;
    currency: 'USD' | 'TRY' | 'EUR';
    qty: number;
    moq?: number;
    thumbnail?: string | null;
    inStock: boolean;
  };
}

export default function CartLineItem({ item }: CartLineItemProps) {
  const { inc, dec, removeItem, updateQuantity } = useCart();
  const { colors } = useTheme();
  const [unitTRY, setUnitTRY] = useState(item.currency === 'TRY' ? item.unitPrice : 0);
  
  // TRY'ye çevir
  useEffect(() => {
    if (item.currency === 'TRY') {
      setUnitTRY(item.unitPrice);
    } else {
      convert(item.unitPrice, item.currency, 'TRY').then(setUnitTRY);
    }
  }, [item.unitPrice, item.currency]);
  
  const isMOQViolation = item.moq && item.qty < item.moq;
  const canDecrement = item.qty > 1;
  
  const handleDecrement = () => {
    if (canDecrement) {
      dec(item.id);
    }
  };
  
  const handleSetMOQ = () => {
    if (item.moq) {
      updateQuantity(item.id, item.moq);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Supplier Badge */}
      {item.supplier && (
        <View style={[styles.supplierBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.supplierText, { color: colors.buttonText }]}>{item.supplier}</Text>
        </View>
      )}
      
      <View style={styles.content}>
        {/* Thumbnail */}
        <View style={styles.thumbnailContainer}>
          {item.thumbnail ? (
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="cube-outline" size={24} color={colors.textSecondary} />
            </View>
          )}
        </View>
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {item.name}
          </Text>
          
          {/* Stock Status */}
          <View style={styles.stockRow}>
            <View style={[
              styles.stockIndicator, 
              { backgroundColor: item.inStock ? colors.success : colors.error }
            ]} />
            <Text style={[styles.stockText, { color: item.inStock ? colors.success : colors.error }]}>
              {item.inStock ? '✓ Stokta' : '✗ Stok Yok'}
            </Text>
          </View>
          
          {/* MOQ Info */}
          {item.moq && item.moq > 1 && (
            <Text style={[styles.moqInfo, { color: colors.textSecondary }]}>
              Min. sipariş: {item.moq} adet
            </Text>
          )}
        </View>
        
        {/* Price & Quantity */}
        <View style={styles.rightSection}>
          {/* Price Display */}
          <View style={styles.priceSection}>
            <Text style={[styles.priceMain, { color: colors.text }]}>
              ₺{(unitTRY * item.qty).toFixed(2)}
            </Text>
            <Text style={[styles.priceBreakdown, { color: colors.textSecondary }]}>
              ₺{unitTRY.toFixed(2)} × {item.qty}
            </Text>
            {item.currency !== 'TRY' && (
              <Text style={[styles.priceOriginal, { color: colors.textSecondary }]}>
                ≈ {format(item.unitPrice, item.currency)}
              </Text>
            )}
          </View>
          
          {/* Quantity Stepper */}
          <View style={styles.quantitySection}>
            <Pressable 
              style={[
                styles.quantityBtn, 
                { 
                  backgroundColor: canDecrement ? colors.buttonSecondary : colors.backgroundSecondary,
                  opacity: canDecrement ? 1 : 0.5
                }
              ]}
              onPress={handleDecrement}
              disabled={!canDecrement}
            >
              <Ionicons name="remove" size={16} color={colors.text} />
            </Pressable>
            
            <Text style={[styles.quantityText, { color: colors.text }]}>
              {item.qty}
            </Text>
            
            <Pressable 
              style={[styles.quantityBtn, { backgroundColor: colors.buttonSecondary }]}
              onPress={() => inc(item.id)}
            >
              <Ionicons name="add" size={16} color={colors.text} />
            </Pressable>
          </View>
        </View>
      </View>
      
      {/* MOQ Warning */}
      {isMOQViolation && (
        <View style={[styles.moqWarning, { backgroundColor: colors.errorBackground }]}>
          <Text style={[styles.moqWarningText, { color: colors.error }]}>
            ⚠️ Minimum sipariş: {item.moq} adet (sepette {item.qty})
          </Text>
          <Pressable onPress={handleSetMOQ} style={styles.moqFixButton}>
            <Text style={[styles.moqFixText, { color: colors.primary }]}>
              {item.moq} yap
            </Text>
          </Pressable>
        </View>
      )}
      
      {/* Remove Button - New Integrated Design */}
      <View style={styles.removeButtonRow}>
        <Pressable 
          style={[styles.removeButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={() => removeItem(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.removeText, { color: colors.textSecondary }]}>Kaldır</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  supplierBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  supplierText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    flexDirection: 'row',
    gap: 16,
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    gap: 6,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moqInfo: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 12,
  },
  priceSection: {
    alignItems: 'flex-end',
    gap: 2,
  },
  priceMain: {
    fontSize: 18,
    fontWeight: '800',
  },
  priceBreakdown: {
    fontSize: 12,
    fontWeight: '500',
  },
  priceOriginal: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  moqWarning: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  moqWarningText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  moqFixButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  moqFixText: {
    fontSize: 12,
    fontWeight: '600',
  },
  removeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  removeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
