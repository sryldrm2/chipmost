import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useCheckout } from '../../context/CheckoutContext';
import CheckoutProgress from '../../components/CheckoutProgress';
import DeliveryAddressScreen from './DeliveryAddressScreen';
import PaymentMethodScreen from './PaymentMethodScreen';
import OrderSummaryScreen from './OrderSummaryScreen';

export default function CheckoutScreen() {
  const { state } = useCheckout();

  const renderCurrentStep = () => {
    switch (state.step) {
      case 'address':
        return <DeliveryAddressScreen />;
      case 'payment':
        return <PaymentMethodScreen />;
      case 'summary':
        return <OrderSummaryScreen />;
      default:
        return <DeliveryAddressScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <CheckoutProgress currentStep={state.step} />
      {renderCurrentStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

