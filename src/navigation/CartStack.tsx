import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CartStackParamList } from '../types/navigation';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrderSuccessScreen from '../screens/checkout/OrderSuccessScreen';

const Stack = createStackNavigator<CartStackParamList>();

export default function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CartScreen" 
        component={CartScreen} 
        options={{ title: 'Sepet' }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen} 
        options={{ title: 'Ödeme' }}
      />
      <Stack.Screen 
        name="OrderSuccess" 
        component={OrderSuccessScreen} 
        options={{ title: 'Sipariş Başarılı' }}
      />
    </Stack.Navigator>
  );
}
