import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface StickyCTAProps {
  onCheckout: () => void;
  isCheckoutDisabled: boolean;
  moqViolations: Array<{ id: string; need: number; have: number }>;
  totalItems: number;
}

export default function StickyCTA({ 
  onCheckout, 
  isCheckoutDisabled, 
  moqViolations, 
  totalItems 
}: StickyCTAProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* MOQ Warning Banner */}
      {moqViolations.length > 0 && (
        <View style={[styles.moqBanner, { backgroundColor: colors.errorBackground }]}>
          <Ionicons name="warning" size={16} color={colors.error} />
          <Text style={[styles.moqBannerText, { color: colors.error }]}>
            Bazı ürünlerde <Text style={{ fontWeight: '700' }}>minimum sipariş</Text> şartı var. 
            Düzeltin veya '{moqViolations[0].need} yap'a dokunun.
          </Text>
        </View>
      )}
      
      {/* Checkout Button */}
      <Pressable
        style={[
          styles.checkoutButton,
          { 
            backgroundColor: isCheckoutDisabled ? colors.backgroundSecondary : colors.primary,
            opacity: isCheckoutDisabled ? 0.6 : 1
          }
        ]}
        onPress={onCheckout}
        disabled={isCheckoutDisabled}
      >
        <View style={styles.buttonContent}>
          <View style={styles.buttonLeft}>
            <Text style={[styles.checkoutText, { color: colors.buttonText }]}>
              {isCheckoutDisabled ? 'MOQ Hatası' : 'Siparişi Onayla'}
            </Text>
            <Text style={[styles.itemCount, { color: colors.buttonTextSecondary }]}>
              {totalItems} ürün
            </Text>
          </View>
          <Ionicons 
            name={isCheckoutDisabled ? "alert-circle" : "arrow-forward"} 
            size={20} 
            color={colors.buttonText} 
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32, // Safe area için
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  moqBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  moqBannerText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  checkoutButton: {
    borderRadius: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  buttonLeft: {
    flex: 1,
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '500',
  },
});
