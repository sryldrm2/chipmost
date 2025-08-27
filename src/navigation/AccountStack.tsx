import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AccountStackParamList } from '../types/navigation';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import AccountHomeScreen from '../screens/account/AccountHomeScreen';
import ProfileEditScreen from '../screens/account/ProfileEditScreen';
import AddressManagementScreen from '../screens/account/AddressManagementScreen';
import OrderHistoryScreen from '../screens/account/OrderHistoryScreen';
import OrderDetailScreen from '../screens/account/OrderDetailScreen';

const Stack = createStackNavigator<AccountStackParamList>();

export default function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="AccountHome" component={AccountHomeScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="AddressManagement" component={AddressManagementScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}

