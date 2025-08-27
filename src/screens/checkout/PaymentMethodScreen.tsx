import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCheckout } from '../../context/CheckoutContext';
import { PaymentMethod, CreditCardInfo } from '../../types/checkout';

export default function PaymentMethodScreen() {
  const { state, setPaymentMethod, setCreditCardInfo, setStep } = useCheckout();
  
  const [creditCardInfo, setLocalCreditCardInfo] = useState<CreditCardInfo>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  const paymentMethods = [
    {
      id: 'credit_card' as PaymentMethod,
      title: 'Kredi Kartı',
      subtitle: 'Güvenli ödeme ile anında onay',
      icon: 'card',
      color: '#0a58ca'
    },
    {
      id: 'cash_on_delivery' as PaymentMethod,
      title: 'Kapıda Ödeme',
      subtitle: 'Teslimatta nakit veya kart ile ödeyin',
      icon: 'cash',
      color: '#198754'
    },
    {
      id: 'bank_transfer' as PaymentMethod,
      title: 'Havale / EFT',
      subtitle: 'Banka hesabımıza transfer yapın',
      icon: 'business',
      color: '#fd7e14'
    }
  ];

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    
    if (method === 'credit_card') {
      // Kredi kartı seçildiğinde mevcut bilgileri yükle
      if (state.creditCardInfo) {
        setLocalCreditCardInfo(state.creditCardInfo);
      }
    }
  };

  const handleCreditCardChange = (field: keyof CreditCardInfo, value: string) => {
    setLocalCreditCardInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateCreditCard = (): boolean => {
    if (!creditCardInfo.cardNumber || creditCardInfo.cardNumber.length !== 16) return false;
    if (!creditCardInfo.expiryMonth || creditCardInfo.expiryMonth.length !== 2) return false;
    if (!creditCardInfo.expiryYear || creditCardInfo.expiryYear.length !== 2) return false;
    if (!creditCardInfo.cvv || creditCardInfo.cvv.length !== 3) return false;
    if (!creditCardInfo.cardholderName.trim()) return false;
    return true;
  };

  const handleContinue = () => {
    if (!state.selectedPaymentMethod) {
      Alert.alert('Uyarı', 'Lütfen bir ödeme yöntemi seçin.');
      return;
    }

    if (state.selectedPaymentMethod === 'credit_card') {
      if (!validateCreditCard()) {
        Alert.alert('Uyarı', 'Lütfen kredi kartı bilgilerini eksiksiz doldurun.');
        return;
      }
      
      // Kredi kartı bilgilerini kaydet
      setCreditCardInfo(creditCardInfo);
    }

    setStep('summary');
  };

  const handleBack = () => {
    setStep('address');
  };

  const renderPaymentMethod = (method: typeof paymentMethods[0]) => (
    <Pressable
      key={method.id}
      style={[
        styles.paymentMethodCard,
        state.selectedPaymentMethod === method.id && styles.selectedPaymentMethodCard
      ]}
      onPress={() => handlePaymentMethodSelect(method.id)}
    >
      <View style={styles.paymentMethodHeader}>
        <View style={[styles.paymentIcon, { backgroundColor: method.color }]}>
          <Ionicons name={method.icon as any} size={24} color="#fff" />
        </View>
        
        <View style={styles.paymentMethodInfo}>
          <Text style={styles.paymentMethodTitle}>{method.title}</Text>
          <Text style={styles.paymentMethodSubtitle}>{method.subtitle}</Text>
        </View>
        
        {state.selectedPaymentMethod === method.id && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color="#198754" />
          </View>
        )}
      </View>
    </Pressable>
  );

  const renderCreditCardForm = () => {
    if (state.selectedPaymentMethod !== 'credit_card') return null;

    return (
      <View style={styles.creditCardForm}>
        <Text style={styles.formTitle}>Kredi Kartı Bilgileri</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kart Numarası</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            value={creditCardInfo.cardNumber}
            onChangeText={(value) => handleCreditCardChange('cardNumber', value.replace(/\D/g, '').slice(0, 16))}
            keyboardType="numeric"
            maxLength={16}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Son Kullanma Ay</Text>
            <TextInput
              style={styles.input}
              placeholder="12"
              value={creditCardInfo.expiryMonth}
              onChangeText={(value) => handleCreditCardChange('expiryMonth', value.replace(/\D/g, '').slice(0, 2))}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Yıl</Text>
            <TextInput
              style={styles.input}
              placeholder="25"
              value={creditCardInfo.expiryYear}
              onChangeText={(value) => handleCreditCardChange('expiryYear', value.replace(/\D/g, '').slice(0, 2))}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              value={creditCardInfo.cvv}
              onChangeText={(value) => handleCreditCardChange('cvv', value.replace(/\D/g, '').slice(0, 3))}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Kart Sahibi</Text>
            <TextInput
              style={styles.input}
              placeholder="Ad Soyad"
              value={creditCardInfo.cardholderName}
              onChangeText={(value) => handleCreditCardChange('cardholderName', value)}
              autoCapitalize="words"
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ödeme Yöntemi</Text>
          <Text style={styles.subtitle}>
            Siparişiniz için ödeme yöntemini seçin
          </Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsSection}>
          <Text style={styles.sectionTitle}>Ödeme Seçenekleri</Text>
          <View style={styles.paymentMethodsList}>
            {paymentMethods.map(renderPaymentMethod)}
          </View>
        </View>

        {/* Credit Card Form */}
        {renderCreditCardForm()}

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color="#666" />
            <Text style={styles.backButtonText}>Geri</Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.continueButton,
              !state.selectedPaymentMethod && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!state.selectedPaymentMethod}
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
  paymentMethodsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  paymentMethodsList: {
    gap: 12,
  },
  paymentMethodCard: {
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
  selectedPaymentMethodCard: {
    borderColor: '#198754',
    backgroundColor: '#f8fff9',
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  paymentMethodSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  selectedIndicator: {
    // Selected indicator styles
  },
  creditCardForm: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
  continueButton: {
    flex: 2,
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

