import { CartLine } from '../cart/CartTypes';
import { DeliveryAddress, PaymentMethod } from '../types/checkout';

export type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  thumbnail?: string | null;
};

export type Order = {
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

// Mock sipariş veritabanı
let mockOrders: Order[] = [
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
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-003',
    date: '26.01.2032',
    total: 1567.25,
    status: 'processing',
    canCancel: true,
    canReturn: false,
    shippingAddress: 'Çankaya Mah. Atatürk Bulvarı No:67, Çankaya/Ankara',
    paymentMethod: 'Kredi Kartı',
    items: [
      { id: '6', productName: 'Arduino Uno R3', quantity: 2, price: 125.00 },
      { id: '7', productName: 'Breadboard 830 Points', quantity: 1, price: 45.00 },
      { id: '8', productName: 'Jumper Wires Set', quantity: 1, price: 35.00 },
      { id: '9', productName: '9V Battery Clip', quantity: 5, price: 1262.25 }
    ]
  }
];

export const orderService = {
  // Sipariş oluştur
  createOrder: async (
    cartItems: CartLine[],
    total: number,
    address: DeliveryAddress,
    paymentMethod: PaymentMethod
  ): Promise<Order> => {
    // Mock API çağrısı simülasyonu
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber,
      date: new Date().toLocaleDateString('tr-TR'),
      total,
      status: 'pending',
      canCancel: true,
      canReturn: false,
      shippingAddress: `${address.district}, ${address.city} ${address.postalCode}`,
      paymentMethod: paymentMethod === 'credit_card' ? 'Kredi Kartı' : 
                    paymentMethod === 'cash_on_delivery' ? 'Kapıda Ödeme' : 'Havale/EFT',
      items: cartItems.map(item => ({
        id: item.id,
        productName: item.name,
        quantity: item.qty,
        price: item.price,
        thumbnail: item.thumbnail
      }))
    };
    
    mockOrders.unshift(newOrder);
    return newOrder;
  },

  // Tüm siparişleri getir
  getOrders: async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockOrders];
  },

  // Sipariş detayını getir
  getOrderById: async (orderId: string): Promise<Order | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockOrders.find(order => order.id === orderId) || null;
  },

  // Sipariş iptal et
  cancelOrder: async (orderId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1 && mockOrders[orderIndex].canCancel) {
      mockOrders[orderIndex].status = 'cancelled';
      mockOrders[orderIndex].canCancel = false;
      return true;
    }
    return false;
  },

  // İade talebi oluştur
  createReturnRequest: async (orderId: string, reason: string, description: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const order = mockOrders.find(order => order.id === orderId);
    if (order && order.canReturn) {
      // Gerçek uygulamada iade talebi veritabanına kaydedilir
      console.log('İade talebi oluşturuldu:', { orderId, reason, description });
      return true;
    }
    return false;
  },

  // Sipariş durumunu güncelle (mock olarak otomatik ilerleme)
  updateOrderStatus: async (orderId: string, newStatus: Order['status']): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      mockOrders[orderIndex].status = newStatus;
      
      // Durum değişikliklerinde canCancel ve canReturn güncelle
      if (newStatus === 'delivered') {
        mockOrders[orderIndex].canCancel = false;
        mockOrders[orderIndex].canReturn = true;
      } else if (newStatus === 'shipped') {
        mockOrders[orderIndex].canCancel = false;
        mockOrders[orderIndex].canReturn = false;
      }
      
      return true;
    }
    return false;
  }
};

