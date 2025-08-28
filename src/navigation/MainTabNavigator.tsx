import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SearchStack from './SearchStack';
import CatalogStack from './CatalogStack';
import CartStack from './CartStack';
import AccountStack from './AccountStack';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { state: authState } = useAuth();
  const { colors } = useTheme();
  
  // Cart tab için özel icon component
  function CartTabIcon({ focused, color, size }: { focused: boolean; color: string; size: number }) {
    const { totalCount } = useCart();

    return (
      <View style={styles.iconContainer}>
        <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={color} />
        {totalCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalCount > 99 ? '99+' : totalCount}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Catalog') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Cart') {
            return <CartTabIcon focused={focused} color={color} size={size} />;
          } else if (route.name === 'Account') {
            // Account tab için authentication durumuna göre icon
            if (authState.isAuthenticated) {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'log-in-outline';
            }
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Ana Sayfa' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchStack}
        options={{ title: 'Arama', headerShown: false }}
      />
      <Tab.Screen 
        name="Catalog" 
        component={CatalogStack}
        options={{ title: 'Katalog' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartStack}
        options={{ title: 'Sepet' }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountStack}
        options={{ 
          title: authState.isAuthenticated ? 'Hesabım' : 'Giriş Yap'
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
