import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CatalogStackParamList } from '../types/navigation';
import CategoryDetailScreen from '../screens/catalog/CategoryDetailScreen';
import CatalogHomeScreen from '../screens/catalog/CatalogHomeScreen';
import ProductList from '../screens/catalog/ProductList';
import ProductDetail from '../screens/catalog/ProductDetail';

const Stack = createStackNavigator<CatalogStackParamList>();

export default function CatalogStack({ navigation }: any) {
  // Tab'a basıldığında stack'i temizle
  useFocusEffect(
    React.useCallback(() => {
      // Stack'te birden fazla ekran varsa, ilk ekrana dön
      if (navigation.canGoBack()) {
        navigation.navigate('CatalogHome');
      }
    }, [navigation])
  );

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CatalogHome" 
        component={CatalogHomeScreen} 
        options={{ title: 'Katalog' }}
      />
      <Stack.Screen 
        name="CategoryDetail" 
        component={CategoryDetailScreen} 
        options={{ title: 'Kategori Detayı' }}
      />
      <Stack.Screen 
        name="ProductList" 
        component={ProductList} 
        options={{ title: 'Ürün Listesi' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetail} 
        options={{ title: 'Ürün Detayı' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
