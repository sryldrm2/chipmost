import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Modal
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCheckout } from '../../context/CheckoutContext';

export default function OrderSuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderNumber } = route.params;
  const { resetCheckout } = useCheckout();

  // Bildirim state'i
  const [notification, setNotification] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: ''
  });

  console.log('OrderSuccessScreen rendered with orderNumber:', orderNumber);
  console.log('Route params:', route.params);

  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Animasyonları başlat
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Checkout state'ini temizle
    resetCheckout();

    // Web simülatör için bildirim dinleyicisi
    const checkForNotifications = () => {
      // Console'dan bildirim log'larını yakala
      const originalLog = console.log;
      console.log = (...args) => {
        originalLog(...args);
        
        // Push notification log'unu yakala
        if (args[0] === '🔔 Push Notification:' && args[1]) {
          const notificationData = args[1];
          setNotification({
            visible: true,
            title: notificationData.title,
            message: notificationData.message
          });
        }
      };

      return () => {
        console.log = originalLog;
      };
    };

    const cleanup = checkForNotifications();
    return cleanup;
  }, []);

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const handleViewOrders = () => {
    // Ana navigasyona dön ve OrderHistory'ye git
    navigation.reset({
      index: 0,
      routes: [
        { name: 'MainTabs', params: { screen: 'Account', params: { screen: 'OrderHistory' } } }
      ]
    });
  };

  const handleContinueShopping = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Animated.View
            style={[
              styles.successIcon,
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={80} color="#198754" />
          </Animated.View>
        </View>

        {/* Success Message */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.successTitle}>Siparişiniz Alındı! 🎉</Text>
          <Text style={styles.successMessage}>
            Siparişiniz başarıyla oluşturuldu. Sipariş detaylarını e-posta adresinize gönderdik.
          </Text>
        </Animated.View>

        {/* Order Number */}
        <Animated.View style={[styles.orderNumberCard, { opacity: fadeAnim }]}>
          <Text style={styles.orderNumberLabel}>Sipariş Numarası</Text>
          <Text style={styles.orderNumber}>{orderNumber}</Text>
          <Text style={styles.orderNumberHint}>
            Bu numarayı saklayın, sipariş takibi için gerekli
          </Text>
        </Animated.View>

        {/* Next Steps */}
        <Animated.View style={[styles.nextStepsCard, { opacity: fadeAnim }]}>
          <Text style={styles.nextStepsTitle}>Sonraki Adımlar</Text>
          
          <View style={styles.stepItem}>
            <View style={styles.stepIcon}>
              <Ionicons name="time-outline" size={20} color="#0a58ca" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Sipariş Hazırlanıyor</Text>
              <Text style={styles.stepDescription}>
                24-48 saat içinde siparişiniz hazırlanacak
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepIcon}>
              <Ionicons name="car-outline" size={20} color="#6f42c1" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Kargoya Veriliyor</Text>
              <Text style={styles.stepDescription}>
                Kargo firması ile teslimat bilgileri paylaşılacak
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepIcon}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#198754" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Teslimat</Text>
              <Text style={styles.stepDescription}>
                2-4 iş günü içinde adresinize teslim edilecek
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.buttonSection, { opacity: fadeAnim }]}>
          <Pressable style={styles.primaryButton} onPress={handleViewOrders}>
            <Ionicons name="receipt-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Sipariş Geçmişine Git</Text>
          </Pressable>
          
          <Pressable style={styles.secondaryButton} onPress={handleContinueShopping}>
            <Ionicons name="home-outline" size={20} color="#111" />
            <Text style={styles.secondaryButtonText}>Alışverişe Devam Et</Text>
          </Pressable>
        </Animated.View>

        {/* Footer Info */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.footerText}>
            Herhangi bir sorunuz varsa müşteri hizmetlerimizle iletişime geçin
          </Text>
          <Pressable style={styles.supportButton}>
            <Ionicons name="chatbubble-outline" size={16} color="#0a58ca" />
            <Text style={styles.supportButtonText}>Destek Al</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* Web Simülatör için Bildirim Modal'ı */}
      {notification.visible && (
        <Modal
          visible={notification.visible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeNotification}
        >
          <View style={styles.notificationOverlay}>
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Ionicons name="notifications" size={24} color="#0a58ca" />
                <Text style={styles.notificationTitle}>{notification.title}</Text>
              </View>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Pressable style={styles.notificationCloseButton} onPress={closeNotification}>
                <Text style={styles.notificationCloseButtonText}>Tamam</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
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
    alignItems: 'center',
  },
  iconContainer: {
    marginVertical: 40,
    alignItems: 'center',
  },
  successIcon: {
    // Animation styles
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  orderNumberCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
    maxWidth: 350,
  },
  orderNumberLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  orderNumberHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  nextStepsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
    maxWidth: 350,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonSection: {
    width: '100%',
    maxWidth: 350,
    gap: 12,
    marginBottom: 32,
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
  footer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supportButtonText: {
    color: '#0a58ca',
    fontSize: 14,
    fontWeight: '600',
  },
  // Bildirim Modal Stilleri
  notificationOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  notificationContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },
  notificationMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  notificationCloseButton: {
    backgroundColor: '#0a58ca',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  notificationCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
