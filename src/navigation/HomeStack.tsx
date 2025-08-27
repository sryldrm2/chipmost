import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeStackParamList } from '../types/navigation';
import HomePageScreen from '../screens/HomePageScreen';

const Stack = createStackNavigator<HomeStackParamList>();

function ProductDetailScreen({ navigation, route }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ürün Detayı</Text>
      <Text style={styles.subtitle}>Ürün ID: {route.params.productId}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

function CategoryListScreen({ navigation, route }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategori Listesi</Text>
      <Text style={styles.subtitle}>Kategori ID: {route.params.categoryId}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomePageScreen} 
        options={{ title: 'Ana Sayfa' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ title: 'Ürün Detayı' }}
      />
      <Stack.Screen 
        name="CategoryList" 
        component={CategoryListScreen} 
        options={{ title: 'Kategori Listesi' }}
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
