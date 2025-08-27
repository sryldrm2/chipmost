import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['chipmost://', 'https://chipmost.com'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Catalog: {
            screens: {
              CategoryDetail: 'category/:categoryId',
              ProductList: 'products/:categoryId',
              ProductDetail: 'product/:productId',
            },
          },
          Home: {
            screens: {
              HomeScreen: '',
            },
          },
          Search: {
            screens: {
              SearchScreen: 'search',
              SearchResults: 'search/results',
              FilterScreen: 'search/filters',
            },
          },
          Cart: {
            screens: {
              CartScreen: 'cart',
              Checkout: 'cart/checkout',
              OrderConfirmation: 'cart/confirmation',
            },
          },
            Account: {
    screens: {
      SignIn: 'signin',
      SignUp: 'signup',
      ForgotPassword: 'forgot-password',
      AccountHome: 'account',
      ProfileEdit: 'profile-edit',
      AddressManagement: 'addresses',
      OrderHistory: 'orders',
      OrderDetail: 'order/:orderId',
    },
  },
        },
      },
    },
  },
};
