import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { CartProvider } from './src/cart/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { CheckoutProvider } from './src/context/CheckoutContext';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <CheckoutProvider>
                <RootNavigator />
              </CheckoutProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

