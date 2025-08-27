import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchFilterProvider } from '../features/search/SearchFilterContext';
import SearchScreen from '../screens/search/SearchScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createStackNavigator();

export default function SearchStack() {
  return (
    <SearchFilterProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ title: 'Arama' }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Ürün Detayı' }}
        />
      </Stack.Navigator>
    </SearchFilterProvider>
  );
}
