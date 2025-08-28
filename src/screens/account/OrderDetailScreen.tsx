import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
  Modal,
  TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// Mock order service - gerçek uygulamada backend'den gelecek
type Order = {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress?: string;
  paymentMethod?: string;
  canCancel?: boolean;
  canReturn?: boolean;
};

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  thumbnail?: string;
};

export default function OrderDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId } = route.params;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock order data - gerçek uygulamada API'den gelecek
      const mockOrder: Order = {
        id: orderId,
        orderNumber: `ORD-${orderId}`,
        date: new Date().toLocaleDateString('tr-TR'),
        total: 1250.00,
        status: 'processing',
        canCancel: true,
        canReturn: false,
        shippingAddress: 'Atatürk Mah. Cumhuriyet Cad. No:123 D:4, Kadıköy/İstanbul',
        paymentMethod: 'Kredi Kartı',
        items: [
          { id: '1', productName: 'RF Connector SMA Male', quantity: 2, price: 45.00 },
          { id: '2', productName: 'BNC Connector Female', quantity: 1, price: 32.00 },
          { id: '3', productName: 'Coaxial Cable RG58', quantity: 5, price: 228.00 }
        ]
      };
      
      setOrder(mockOrder);
    } catch (err: any) {
      setError('Sipariş yüklenirken bir hata oluştu');
      Alert.alert('Hata', 'Sipariş yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#0a58ca';
      case 'shipped': return '#6f42c1';
      case 'delivered': return '#198754';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'processing': return 'Hazırlanıyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'processing': return 'construct-outline';
      case 'shipped': return 'car-outline';
      case 'delivered': return 'checkmark-circle-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const formatPrice = (price: number) => {
    return `₺${price.toFixed(2)}`;
  };

  const calculateSubtotal = () => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    if (!order) return 0;
    const subtotal = calculateSubtotal();
    // Ücretsiz kargo 1000₺ üzeri
    return subtotal >= 1000 ? 0 : 29.99;
  };

  // Sipariş iptal et
  const handleCancelOrder = async () => {
    if (!order) return;
    setShowCancelModal(true);
  };

  // İptal işlemini gerçekleştir
  const confirmCancelOrder = async () => {
    if (!order) return;
    
    try {
      // Mock iptal işlemi - gerçek uygulamada API'ye gönderilecek
      setOrder(prev => prev ? { ...prev, status: 'cancelled', canCancel: false } : null);
      
      setShowCancelModal(false);
      Alert.alert('Başarılı', 'Sipariş iptal edildi.');
    } catch (error) {
      console.error('❌ İptal hatası:', error);
      setShowCancelModal(false);
      Alert.alert('Hata', 'İptal işlemi sırasında bir hata oluştu.');
    }
  };

  // İade talebi oluştur
  const handleCreateReturn = async () => {
    if (!returnReason.trim()) {
      Alert.alert('Uyarı', 'Lütfen iade nedenini belirtin.');
      return;
    }

    try {
      // Mock iade talebi - gerçek uygulamada API'ye gönderilecek
      Alert.alert('Başarılı', 'İade talebiniz alındı. En kısa sürede size dönüş yapılacak.');
      setShowReturnModal(false);
      setReturnReason('');
      setReturnDescription('');
    } catch (error) {
      Alert.alert('Hata', 'İade talebi sırasında bir hata oluştu.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.loadingText}>Sipariş yükleniyor...</Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#dc3545" />
        <Text style={styles.errorTitle}>Bir hata oluştu</Text>
        <Text style={styles.errorText}>{error || 'Sipariş bulunamadı'}</Text>
        <Pressable style={styles.retryButton} onPress={loadOrder}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </Pressable>
        
        <Text style={styles.title}>Sipariş Detayı</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Order Info Card */}
        <View style={styles.orderInfoCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <View style={styles.statusBadge}>
              <Ionicons 
                name={getStatusIcon(order.status) as any} 
                size={16} 
                color={getStatusColor(order.status)} 
              />
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>
          
          <View style={styles.orderMeta}>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.metaText}>Sipariş Tarihi: {order.date}</Text>
            </View>
            
            {order.shippingAddress && (
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.metaText}>Teslimat Adresi: {order.shippingAddress}</Text>
              </View>
            )}
            
            {order.paymentMethod && (
              <View style={styles.metaRow}>
                <Ionicons name="card-outline" size={16} color="#666" />
                <Text style={styles.metaText}>Ödeme Yöntemi: {order.paymentMethod}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Sipariş Ürünleri</Text>
          
          {order.items.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </View>
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                <Text style={styles.itemTotal}>
                  Toplam: {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ara Toplam:</Text>
              <Text style={styles.summaryValue}>{formatPrice(calculateSubtotal())}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Kargo:</Text>
              <Text style={[
                styles.summaryValue,
                calculateShipping() === 0 && styles.freeShipping
              ]}>
                {calculateShipping() === 0 ? 'Ücretsiz' : formatPrice(calculateShipping())}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Toplam:</Text>
              <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {order.canCancel && order.status === 'pending' && (
            <Pressable style={[styles.primaryButton, styles.cancelButton]} onPress={handleCancelOrder}>
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Siparişi İptal Et</Text>
            </Pressable>
          )}
          
          {order.canReturn && order.status === 'delivered' && (
            <Pressable style={[styles.primaryButton, styles.returnButton]} onPress={() => setShowReturnModal(true)}>
              <Ionicons name="refresh-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>İade Talep Et</Text>
            </Pressable>
          )}
          
          {!order.canCancel && !order.canReturn && (
            <Pressable style={styles.primaryButton}>
              <Ionicons name="refresh-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Siparişi Takip Et</Text>
            </Pressable>
          )}
          
          <Pressable style={styles.secondaryButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#111" />
            <Text style={styles.secondaryButtonText}>Destek Al</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* İptal Onay Modal */}
      <Modal
        visible={showCancelModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning" size={32} color="#dc3545" />
              <Text style={styles.modalTitle}>Sipariş İptali</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                Bu siparişi iptal etmek istediğinizden emin misiniz?
              </Text>
              <Text style={styles.modalHint}>
                İptal işlemi geri alınamaz.
              </Text>
            </View>
            
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Vazgeç</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalSubmitButton, styles.cancelConfirmButton]}
                onPress={confirmCancelOrder}
              >
                <Text style={styles.modalSubmitButtonText}>İptal Et</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* İade Modal */}
      <Modal
        visible={showReturnModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReturnModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>İade Talebi</Text>
              <Pressable onPress={() => setShowReturnModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </Pressable>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>İade Nedeni *</Text>
              <Pressable
                style={styles.reasonSelector}
                onPress={() => {
                  Alert.alert(
                    'İade Nedeni',
                    'Lütfen bir neden seçin:',
                    [
                      { text: 'Yanlış Ürün', onPress: () => setReturnReason('Yanlış Ürün') },
                      { text: 'Hasarlı Ürün', onPress: () => setReturnReason('Hasarlı Ürün') },
                      { text: 'Beklentimi Karşılamadı', onPress: () => setReturnReason('Beklentimi Karşılamadı') },
                      { text: 'Boyut Uyumsuzluğu', onPress: () => setReturnReason('Boyut Uyumsuzluğu') },
                      { text: 'Diğer', onPress: () => setReturnReason('Diğer') },
                    ]
                  );
                }}
              >
                <Text style={returnReason ? styles.reasonText : styles.placeholderText}>
                  {returnReason || 'İade nedenini seçin'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </Pressable>
              
              <Text style={styles.modalLabel}>Açıklama</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="İade talebiniz hakkında detay verin..."
                value={returnDescription}
                onChangeText={setReturnDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => setShowReturnModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Vazgeç</Text>
              </Pressable>
              
              <Pressable
                style={styles.modalSubmitButton}
                onPress={handleCreateReturn}
              >
                <Text style={styles.modalSubmitButtonText}>İade Talebi Gönder</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dc3545',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orderInfoCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderMeta: {
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  itemsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  summarySection: {
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
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
  freeShipping: {
    color: '#198754',
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
  actionsSection: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#111',
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
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3e3e7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  secondaryButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  returnButton: {
    backgroundColor: '#fd7e14',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },
  modalBody: {
    gap: 16,
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  reasonSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  reasonText: {
    fontSize: 16,
    color: '#111',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    backgroundColor: '#f8f9fa',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelConfirmButton: {
    backgroundColor: '#dc3545',
  },
});
