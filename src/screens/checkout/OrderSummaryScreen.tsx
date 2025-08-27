import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCheckout } from '../../context/CheckoutContext';
import { useCart } from '../../cart/CartContext';
import { orderService } from '../../services/orderService';
import { notificationService } from '../../services/notificationService';

export default function OrderSummaryScreen() {
  const navigation = useNavigation<any>();
  const { state, setStep, setOrderNumber, setProcessing } = useCheckout();
  const { state: cartState, clear } = useCart();

  const handleEditAddress = () => {
    setStep('address');
  };

  const handleEditPayment = () => {
    setStep('payment');
  };

  const getPaymentMethodText = () => {
    switch (state.selectedPaymentMethod) {
      case 'credit_card': return 'Kredi Kartı';
      case 'cash_on_delivery': return 'Kapıda Ödeme';
      case 'bank_transfer': return 'Havale / EFT';
      default: return 'Seçilmedi';
    }
  };

  const getPaymentMethodIcon = () => {
    switch (state.selectedPaymentMethod) {
      case 'credit_card': return 'card';
      case 'cash_on_delivery': return 'cash';
      case 'bank_transfer': return 'business';
      default: return 'help-circle';
    }
  };

  const getPaymentMethodColor = () => {
    switch (state.selectedPaymentMethod) {
      case 'credit_card': return '#0a58ca';
      case 'cash_on_delivery': return '#198754';
      case 'bank_transfer': return '#fd7e14';
      default: return '#ccc';
    }
  };

  const calculateSubtotal = () => {
    return cartState.lines.reduce((sum: number, item) => sum + (item.price * item.qty), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // Ücretsiz kargo 1000₺ üzeri
    return subtotal >= 1000 ? 0 : 29.99;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const discount = cartState.discount || 0;
    return subtotal + shipping - discount;
  };

  const handlePlaceOrder = async () => {
    if (!state.selectedAddress || !state.selectedPaymentMethod) {
      Alert.alert('Uyarı', 'Lütfen tüm gerekli bilgileri doldurun.');
      return;
    }

    if (cartState.lines.length === 0) {
      Alert.alert('Uyarı', 'Sepetiniz boş. Sipariş oluşturmadan önce ürün ekleyin.');
      return;
    }

    setProcessing(true);

    try {
      // Sipariş oluştur
      const total = calculateTotal();
      const newOrder = await orderService.createOrder(
        cartState.lines,
        total,
        state.selectedAddress!,
        state.selectedPaymentMethod!
      );
      
      console.log('Order created:', newOrder);
      
      // Checkout state'ini güncelle
      setOrderNumber(newOrder.orderNumber);
      
      // Sepeti temizle
      clear();
      
      // Push notification'ları planla
      await notificationService.scheduleOrderStatusUpdates(newOrder.orderNumber);
      
      console.log('Navigating to OrderSuccess with orderNumber:', newOrder.orderNumber);
      
      // Başarı ekranına yönlendir
      navigation.navigate('OrderSuccess', { orderNumber: newOrder.orderNumber });
      
    } catch (error) {
      console.error('Error in handlePlaceOrder:', error);
      Alert.alert('Hata', 'Sipariş işlenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setProcessing(false);
    }
  };

  const renderCartItem = (item: any, index: number) => (
    <View key={index} style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>x{item.qty}</Text>
      </View>
      <Text style={styles.itemPrice}>₺{(item.price * item.qty).toFixed(2)}</Text>
    </View>
  );

  const renderSummaryRow = (label: string, value: string, isTotal: boolean = false) => (
    <View style={[styles.summaryRow, isTotal && styles.totalRow]}>
      <Text style={[styles.summaryLabel, isTotal && styles.totalLabel]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, isTotal && styles.totalValue]}>
        {value}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sipariş Özeti</Text>
          <Text style={styles.subtitle}>
            Siparişinizi gözden geçirin ve onaylayın
          </Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
            <Pressable style={styles.editButton} onPress={handleEditAddress}>
              <Ionicons name="create-outline" size={16} color="#0a58ca" />
              <Text style={styles.editButtonText}>Düzenle</Text>
            </Pressable>
          </View>
          
          {state.selectedAddress && (
            <View style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressTitle}>{state.selectedAddress.title}</Text>
                {state.selectedAddress.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Varsayılan</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>
                {state.selectedAddress.district}, {state.selectedAddress.city} {state.selectedAddress.postalCode}
              </Text>
              <Text style={styles.addressDetail}>{state.selectedAddress.detail}</Text>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ödeme Yöntemi</Text>
            <Pressable style={styles.editButton} onPress={handleEditPayment}>
              <Ionicons name="create-outline" size={16} color="#0a58ca" />
              <Text style={styles.editButtonText}>Düzenle</Text>
            </Pressable>
          </View>
          
          {state.selectedPaymentMethod && (
            <View style={styles.paymentCard}>
              <View style={[styles.paymentIcon, { backgroundColor: getPaymentMethodColor() }]}>
                <Ionicons name={getPaymentMethodIcon() as any} size={20} color="#fff" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>{getPaymentMethodText()}</Text>
                {state.selectedPaymentMethod === 'credit_card' && state.creditCardInfo && (
                  <Text style={styles.paymentSubtitle}>
                    **** **** **** {state.creditCardInfo.cardNumber.slice(-4)}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sipariş Ürünleri</Text>
          {cartState.lines.length === 0 ? (
            <View style={styles.emptyCartState}>
              <Ionicons name="cart-outline" size={48} color="#ccc" />
              <Text style={styles.emptyCartTitle}>Sepetiniz boş</Text>
              <Text style={styles.emptyCartText}>
                Sipariş oluşturmadan önce sepete ürün ekleyin
              </Text>
            </View>
          ) : (
            <View style={styles.itemsList}>
              {cartState.lines.map(renderCartItem)}
            </View>
          )}
        </View>

        {/* Order Summary */}
        {cartState.lines.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
            <View style={styles.summaryCard}>
              {renderSummaryRow('Ara Toplam', `₺${calculateSubtotal().toFixed(2)}`)}
              
              {cartState.discount > 0 && (
                renderSummaryRow('Kupon İndirimi', `-₺${cartState.discount.toFixed(2)}`)
              )}
              
              {renderSummaryRow(
                'Kargo', 
                calculateShipping() === 0 ? 'Ücretsiz' : `₺${calculateShipping().toFixed(2)}`
              )}
              
              {renderSummaryRow('Genel Toplam', `₺${calculateTotal().toFixed(2)}`, true)}
            </View>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <Pressable style={styles.backButton} onPress={() => setStep('payment')}>
            <Ionicons name="arrow-back" size={20} color="#666" />
            <Text style={styles.backButtonText}>Geri</Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.placeOrderButton,
              (!state.selectedAddress || !state.selectedPaymentMethod || state.isProcessing || cartState.lines.length === 0) && 
              styles.placeOrderButtonDisabled
            ]}
            onPress={cartState.lines.length === 0 ? () => navigation.navigate('CartScreen') : handlePlaceOrder}
            disabled={!state.selectedAddress || !state.selectedPaymentMethod || state.isProcessing}
          >
            {state.isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : cartState.lines.length === 0 ? (
              <>
                <Text style={styles.placeOrderButtonText}>Sepete Ürün Ekle</Text>
                <Ionicons name="cart-outline" size={20} color="#fff" />
              </>
            ) : (
              <>
                <Text style={styles.placeOrderButtonText}>Siparişi Onayla</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    color: '#0a58ca',
    fontSize: 14,
    fontWeight: '600',
  },
  addressCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  defaultBadge: {
    backgroundColor: '#198754',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
  addressDetail: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  itemsList: {
    gap: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e3e3e7',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  buttonSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3e3e7',
    backgroundColor: '#fff',
    gap: 8,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  placeOrderButton: {
    flex: 2,
    backgroundColor: '#198754',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#ccc',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCartState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyCartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
