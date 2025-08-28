import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

export default function OrderHistoryScreen() {
  const navigation = useNavigation<any>();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Siparişleri yükle
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock order data - gerçek uygulamada API'den gelecek
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2025-001',
          date: '25.08.2025',
          total: 1250.00,
          status: 'delivered',
          canCancel: false,
          canReturn: true,
          shippingAddress: 'Atatürk Mah. Cumhuriyet Cad. No:123 D:4, Kadıköy/İstanbul',
          paymentMethod: 'Kredi Kartı',
          items: [
            { id: '1', productName: 'RF Connector SMA Male', quantity: 2, price: 45.00 },
            { id: '2', productName: 'BNC Connector Female', quantity: 1, price: 32.00 },
            { id: '3', productName: 'Coaxial Cable RG58', quantity: 5, price: 228.00 }
          ]
        },
        {
          id: '2',
          orderNumber: 'ORD-2002-002',
          date: '28.01.2002',
          total: 890.50,
          status: 'shipped',
          canCancel: false,
          canReturn: false,
          shippingAddress: 'Muratçeşme Mah. Güleser Sk. No:28 A Blok Daire:6, Büyükçekmece/İstanbul',
          paymentMethod: 'Havale/EFT',
          items: [
            { id: '4', productName: 'PCB Board 10x15cm', quantity: 3, price: 45.00 },
            { id: '5', productName: 'LED Strip 5m', quantity: 1, price: 755.50 }
          ]
        }
      ];
      
      setOrders(mockOrders);
    } catch (err: any) {
      setError('Siparişler yüklenirken bir hata oluştu');
      console.error('Error loading orders:', err);
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

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const handleOrderDetail = (order: Order) => {
    navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const renderOrderCard = (order: Order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
        </View>
        
        <View style={styles.orderStatus}>
          <Ionicons 
            name={getStatusIcon(order.status) as any} 
            size={20} 
            color={getStatusColor(order.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderSummary}>
        <Text style={styles.itemsCount}>
          {order.items.length} ürün
        </Text>
        <Text style={styles.orderTotal}>
          {formatPrice(order.total)}
        </Text>
      </View>
      
      <View style={styles.orderActions}>
        <Pressable
          style={styles.detailButton}
          onPress={() => handleOrderDetail(order)}
        >
          <Text style={styles.detailButtonText}>Detayı Gör</Text>
          <Ionicons name="chevron-forward" size={16} color="#0a58ca" />
        </Pressable>
      </View>
    </View>
  );

  const handleRefresh = async () => {
    await loadOrders();
  };

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
        
        <Text style={styles.title}>Sipariş Geçmişi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Refresh Button */}
      <View style={styles.refreshSection}>
        <Pressable 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.refreshButtonText}>Yenile</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.ordersList} contentContainerStyle={styles.ordersListContent}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#dc3545" />
            <Text style={styles.errorTitle}>Bir hata oluştu</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </Pressable>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>Henüz sipariş yok</Text>
            <Text style={styles.emptyStateText}>
              İlk siparişinizi verdiğinizde burada görünecek
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsSection}>
              <Text style={styles.statsTitle}>Toplam Sipariş: {orders.length}</Text>
              <Text style={styles.statsSubtitle}>
                Son 30 günde {orders.filter(o => 
                  new Date(o.date.split('.').reverse().join('-')).getTime() > 
                  Date.now() - 30 * 24 * 60 * 60 * 1000
                ).length} sipariş
              </Text>
            </View>
            
            {orders.map(renderOrderCard)}
          </>
        )}
      </ScrollView>
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
  refreshSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  ordersList: {
    flex: 1,
  },
  ordersListContent: {
    padding: 24,
    paddingTop: 0,
  },
  statsSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  itemsCount: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  orderActions: {
    borderTopWidth: 1,
    borderTopColor: '#e3e3e7',
    paddingTop: 16,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailButtonText: {
    color: '#0a58ca',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc3545',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
