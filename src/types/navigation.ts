export type RootStackParamList = {
  MainTabs: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  AccountHome: undefined;
  ProfileEdit: undefined;
  AddressManagement: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Catalog: undefined;
  Cart: undefined;
  Account: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ProductDetail: { productId: string };
  CategoryList: { categoryId: string };
};

export type SearchStackParamList = {
  SearchScreen: undefined;
  ProductDetail: { productId: string };
};

export type CatalogStackParamList = {
  CatalogHome: undefined;
  CategoryDetail: { categoryId: string; mode?: 'subs' | 'products' };
  ProductList: { categoryId: string };
  ProductDetail: { productId: string };
};

export type CartStackParamList = {
  CartScreen: undefined;
  Checkout: undefined;
  OrderSuccess: { orderNumber: string };
};

// Global navigation type'ı da ekleyelim
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type AccountStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  AccountHome: undefined;
  ProfileEdit: undefined;
  AddressManagement: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
  ThemeSettings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
