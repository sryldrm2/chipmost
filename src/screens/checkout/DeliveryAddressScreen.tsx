import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCheckout } from '../../context/CheckoutContext';
import { DeliveryAddress } from '../../types/checkout';

export default function DeliveryAddressScreen() {
  const navigation = useNavigation<any>();
  const { state, setAddress, setStep } = useCheckout();
  
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([
    {
      id: '1',
      title: 'Ev',
      city: 'İstanbul',
      district: 'Kadıköy',
      postalCode: '34710',
      detail: 'Atatürk Mah. Cumhuriyet Cad. No:123 D:4',
      isDefault: true
    },
    {
      id: '2',
      title: 'İş',
      city: 'İstanbul',
      district: 'Beşiktaş',
      postalCode: '34353',
      detail: 'Levent Mah. Büyükdere Cad. No:45 Kat:12',
      isDefault: false
    }
  ]);

  useEffect(() => {
    // Varsayılan adresi otomatik seç
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress && !state.selectedAddress) {
      setAddress(defaultAddress);
    }
  }, []);

  const handleAddressSelect = (address: DeliveryAddress) => {
    setAddress(address);
  };

  const handleAddNewAddress = () => {
    navigation.navigate('AddressManagement');
  };

  const handleContinue = () => {
    if (!state.selectedAddress) {
      Alert.alert('Uyarı', 'Lütfen bir teslimat adresi seçin.');
      return;
    }
    
    setStep('payment');
  };

  const renderAddressCard = (address: DeliveryAddress) => (
    <Pressable
      key={address.id}
      style={[
        styles.addressCard,
        state.selectedAddress?.id === address.id && styles.selectedAddressCard
      ]}
      onPress={() => handleAddressSelect(address)}
    >
      <View style={styles.addressHeader}>
        <View style={styles.addressTitleRow}>
          <Text style={styles.addressTitle}>{address.title}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Varsayılan</Text>
            </View>
          )}
        </View>
        
        {state.selectedAddress?.id === address.id && (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#198754" />
          </View>
        )}
      </View>
      
      <View style={styles.addressContent}>
        <Text style={styles.addressText}>
          {address.district}, {address.city} {address.postalCode}
        </Text>
        <Text style={styles.addressDetail}>{address.detail}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Teslimat Adresi</Text>
          <Text style={styles.subtitle}>
            Siparişinizin teslim edileceği adresi seçin
          </Text>
        </View>

        {/* Address List */}
        <View style={styles.addressSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mevcut Adresler</Text>
            <Pressable 
              style={styles.addButton}
              onPress={handleAddNewAddress}
            >
              <Ionicons name="add" size={20} color="#0a58ca" />
              <Text style={styles.addButtonText}>Yeni Adres Ekle</Text>
            </Pressable>
          </View>
          
          {addresses.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="location-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateTitle}>Henüz adres eklenmemiş</Text>
              <Text style={styles.emptyStateText}>
                İlk adresinizi ekleyerek başlayın
              </Text>
              <Pressable 
                style={styles.primaryButton}
                onPress={handleAddNewAddress}
              >
                <Text style={styles.primaryButtonText}>Adres Ekle</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.addressList}>
              {addresses.map(renderAddressCard)}
            </View>
          )}
        </View>

        {/* Continue Button */}
        <View style={styles.buttonSection}>
          <Pressable
            style={[
              styles.continueButton,
              !state.selectedAddress && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!state.selectedAddress}
          >
            <Text style={styles.continueButtonText}>Devam Et</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
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
  addressSection: {
    marginBottom: 32,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    color: '#0a58ca',
    fontSize: 14,
    fontWeight: '600',
  },
  addressList: {
    gap: 12,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedAddressCard: {
    borderColor: '#198754',
    backgroundColor: '#f8fff9',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressTitle: {
    fontSize: 18,
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
  selectedBadge: {
    // Selected badge styles
  },
  addressContent: {
    marginBottom: 16,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  addressDetail: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
    marginBottom: 20,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#0a58ca',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonSection: {
    marginTop: 'auto',
  },
  continueButton: {
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
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

