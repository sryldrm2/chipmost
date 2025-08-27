import { Alert } from 'react-native';

export type NotificationType = 'order_processing' | 'order_shipped' | 'order_delivered' | 'order_cancelled';

export type NotificationData = {
  type: NotificationType;
  title: string;
  message: string;
  orderNumber?: string;
  delay?: number;
};

export const notificationService = {
  // Mock push notification gönder
  sendNotification: async (data: NotificationData): Promise<void> => {
    const delay = data.delay || 3000; // Varsayılan 3 saniye
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Gerçek uygulamada burada Firebase Cloud Messaging veya OneSignal kullanılır
        console.log('🔔 Push Notification:', data);
        
        // Uygulama içinde toast/alert olarak göster
        Alert.alert(
          data.title,
          data.message,
          [
            {
              text: 'Tamam',
              style: 'default',
            },
          ],
          { cancelable: false }
        );
        
        resolve();
      }, delay);
    });
  },

  // Sipariş işleme bildirimi
  sendOrderProcessingNotification: async (orderNumber: string): Promise<void> => {
    await notificationService.sendNotification({
      type: 'order_processing',
      title: 'Siparişiniz Hazırlanıyor 🚀',
      message: `${orderNumber} numaralı siparişiniz hazırlanmaya başladı. 24-48 saat içinde kargoya verilecek.`,
      orderNumber,
      delay: 2000
    });
  },

  // Sipariş kargoda bildirimi
  sendOrderShippedNotification: async (orderNumber: string): Promise<void> => {
    await notificationService.sendNotification({
      type: 'order_shipped',
      title: 'Siparişiniz Kargoda 📦',
      message: `${orderNumber} numaralı siparişiniz kargoya verildi. Takip numarası e-posta adresinize gönderildi.`,
      orderNumber,
      delay: 5000
    });
  },

  // Sipariş teslim edildi bildirimi
  sendOrderDeliveredNotification: async (orderNumber: string): Promise<void> => {
    await notificationService.sendNotification({
      type: 'order_delivered',
      title: 'Siparişiniz Teslim Edildi ✅',
      message: `${orderNumber} numaralı siparişiniz başarıyla teslim edildi. Memnun kaldıysanız değerlendirme yapabilirsiniz.`,
      orderNumber,
      delay: 8000
    });
  },

  // Sipariş iptal bildirimi
  sendOrderCancelledNotification: async (orderNumber: string): Promise<void> => {
    await notificationService.sendNotification({
      type: 'order_cancelled',
      title: 'Sipariş İptal Edildi ❌',
      message: `${orderNumber} numaralı siparişiniz iptal edildi. İade işlemi 3-5 iş günü içinde tamamlanacak.`,
      orderNumber,
      delay: 1000
    });
  },

  // Otomatik sipariş durumu güncellemeleri (mock)
  scheduleOrderStatusUpdates: async (orderNumber: string): Promise<void> => {
    // Gerçek uygulamada bu işlem backend'de yapılır
    console.log('📅 Scheduling status updates for order:', orderNumber);
    
    // 5 saniye sonra "hazırlanıyor" bildirimi
    setTimeout(async () => {
      await notificationService.sendOrderProcessingNotification(orderNumber);
    }, 5000);
    
    // 15 saniye sonra "kargoda" bildirimi
    setTimeout(async () => {
      await notificationService.sendOrderShippedNotification(orderNumber);
    }, 15000);
    
    // 25 saniye sonra "teslim edildi" bildirimi
    setTimeout(async () => {
      await notificationService.sendOrderDeliveredNotification(orderNumber);
    }, 25000);
  }
};
