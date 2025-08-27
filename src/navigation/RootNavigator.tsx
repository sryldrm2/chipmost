import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import MainTabNavigator from './MainTabNavigator';
import { useAuth } from '../context/AuthContext';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import AccountHomeScreen from '../screens/account/AccountHomeScreen';
import ProfileEditScreen from '../screens/account/ProfileEditScreen';
import AddressManagementScreen from '../screens/account/AddressManagementScreen';
import OrderHistoryScreen from '../screens/account/OrderHistoryScreen';
import OrderDetailScreen from '../screens/account/OrderDetailScreen';
import ThemeSettingsScreen from '../screens/account/ThemeSettingsScreen';
import { linking } from './linking';

const Drawer = createDrawerNavigator<RootStackParamList>();
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="AccountHome" component={AccountHomeScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="AddressManagement" component={AddressManagementScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { state: authState } = useAuth();

  return (
    <NavigationContainer linking={linking}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#FFFFFF',
            width: 280,
          },
          drawerActiveTintColor: '#007AFF',
          drawerInactiveTintColor: '#8E8E93',
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
        }}
      >
        <Drawer.Screen 
          name="MainTabs" 
          component={authState.isAuthenticated ? MainAppStack : AuthStack}
          options={{
            title: 'Chipmost',
            drawerLabel: authState.isAuthenticated ? 'Ana Menü' : 'Giriş Yap',
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
