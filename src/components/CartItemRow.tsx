import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CartLine } from '../cart/CartTypes';
import { convert } from '../utils/currency';

type Props = {
  item: CartLine;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
};

export default function CartItemRow({ item, onIncrement, onDecrement, onRemove, onUpdateQuantity }: Props) {
  const { colors } = useTheme();
  const [unitTRY, setUnitTRY] = useState(0);

  useEffect(() => {
    const convertPrice = async () => {
      try {
        const converted = await convert(item.unitPrice, item.currency, 'TRY');
        setUnitTRY(converted);
      } catch (error) {
        console.error('Price conversion error:', error);
        setUnitTRY(item.unitPrice);
      }
    };
    
    convertPrice();
  }, [item.unitPrice, item.currency]);

  const handleIncrement = () => {
    onIncrement(item.id);
  };

  const handleDecrement = () => {
    if (item.qty > 1) {
      onDecrement(item.id);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const handleUpdateQuantity = () => {
    if (item.moq && item.qty < item.moq) {
      onUpdateQuantity(item.id, item.moq);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        {item.supplier && (
          <View style={[styles.supplierBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.supplierText, { color: colors.textSecondary }]}>
              {item.supplier}
            </Text>
          </View>
        )}
        
        <View style={styles.stockStatus}>
          <Ionicons 
            name={item.inStock ? 'checkmark-circle' : 'close-circle'} 
            size={16} 
            color={item.inStock ? colors.success : colors.error} 
          />
          <Text style={[styles.stockText, { color: item.inStock ? colors.success : colors.error }]}>
            {item.inStock ? 'Stokta' : 'Stok Yok'}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.contentRow}>
        {/* Thumbnail */}
        <View style={styles.thumbnailContainer}>
          {item.thumbnail ? (
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          ) : (
            <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.surface }]}>
              <Ionicons name="cube-outline" size={24} color={colors.textSecondary} />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {item.name}
          </Text>
          
          {/* Price Display */}
          <View style={styles.priceRow}>
            <Text style={[styles.priceMain, { color: colors.text }]}>
              ₺{(unitTRY * item.qty).toFixed(2)}
            </Text>
            <Text style={[styles.priceBreakdown, { color: colors.textSecondary }]}>
              ₺{unitTRY.toFixed(2)} × {item.qty}
            </Text>
          </View>
          
          {/* Secondary Currency */}
          {item.currency !== 'TRY' && (
            <Text style={[styles.priceSecondary, { color: colors.textSecondary }]}>
              ≈ {item.currency} {item.unitPrice.toFixed(2)}
            </Text>
          )}
          
          {/* MOQ Warning */}
          {item.moq && item.qty < item.moq && (
            <View style={styles.moqWarning}>
              <Ionicons name="warning" size={16} color={colors.warning} />
              <Text style={[styles.moqText, { color: colors.warning }]}>
                Min. sipariş: {item.moq} adet
              </Text>
              <Pressable onPress={handleUpdateQuantity} style={styles.moqFixButton}>
                <Text style={[styles.moqFixText, { color: colors.primary }]}>
                  {item.moq} yap
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Quantity Controls */}
        <View style={styles.quantityControls}>
          <Pressable 
            style={[styles.quantityButton, { backgroundColor: colors.surface }]} 
            onPress={handleDecrement}
            disabled={item.qty <= 1}
          >
            <Ionicons name="remove" size={16} color={colors.textSecondary} />
          </Pressable>
          
          <Text style={[styles.quantityText, { color: colors.text }]}>
            {item.qty}
          </Text>
          
          <Pressable 
            style={[styles.quantityButton, { backgroundColor: colors.surface }]} 
            onPress={handleIncrement}
          >
            <Ionicons name="add" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Remove Button */}
      <View style={styles.removeButtonRow}>
        <Pressable 
          style={[styles.removeButton, { backgroundColor: colors.surface }]}
          onPress={handleRemove}
        >
          <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.removeText, { color: colors.textSecondary }]}>Kaldır</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  supplierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  supplierText: {
    fontSize: 10,
    fontWeight: '600',
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbnailContainer: {
    width: 64,
    height: 64,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceMain: {
    fontSize: 18,
    fontWeight: '700',
  },
  priceBreakdown: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceSecondary: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  moqWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  moqText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moqFixButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  moqFixText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
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
