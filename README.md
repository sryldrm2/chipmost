# Chipmost Mobile App

Bu proje, Chipmost mobil uygulamasının React Navigation v6 kullanılarak geliştirilmiş navigasyon altyapısını içermektedir.

## 🚀 Özellikler

- **Drawer Navigator**: Yan menü ile ana navigasyon
- **Tab Navigator**: Alt sekmeler (Home, Search, Catalog, Cart, Account)
- **Stack Navigator**: Her sekmenin kendi içindeki detay ekranları
- **TypeScript Desteği**: Tip güvenliği için tam TypeScript entegrasyonu
- **Deep Linking**: URL tabanlı navigasyon desteği
- **Modern UI**: Chipmost markasına uygun tasarım

## 📱 Navigasyon Yapısı

```
RootNavigator (Drawer)
└── MainTabs (Tab Navigator)
    ├── Home (Stack Navigator)
    │   ├── HomeScreen
    │   ├── ProductDetail
    │   └── CategoryList
    ├── Search (Stack Navigator)
    │   ├── SearchScreen
    │   ├── SearchResults
    │   └── FilterScreen
    ├── Catalog (Stack Navigator)
    │   ├── CatalogScreen
    │   ├── CategoryDetail
    │   └── ProductList
    ├── Cart (Stack Navigator)
    │   ├── CartScreen
    │   ├── Checkout
    │   └── OrderConfirmation
    └── Account (Stack Navigator)
        ├── AccountScreen
        ├── Profile
        ├── Orders
        └── Settings
```

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Expo CLI ile projeyi başlatın:**
   ```bash
   npx expo start
   ```

3. **Mobil cihazda test edin:**
   - Expo Go uygulamasını indirin
   - QR kodu tarayın
   - Veya emülatörde çalıştırın

## 📁 Proje Yapısı

```
src/
├── navigation/
│   ├── RootNavigator.tsx      # Ana drawer navigator
│   ├── MainTabNavigator.tsx   # Tab navigator
│   ├── HomeStack.tsx          # Home stack navigator
│   ├── SearchStack.tsx        # Search stack navigator
│   ├── CatalogStack.tsx       # Catalog stack navigator
│   ├── CartStack.tsx          # Cart stack navigator
│   ├── AccountStack.tsx       # Account stack navigator
│   └── linking.ts             # Deep linking yapılandırması
└── types/
    └── navigation.ts          # Navigation tip tanımları
```

## 🔧 Kullanım

### Navigasyon

```typescript
// Stack navigator'da ekranlar arası geçiş
navigation.navigate('ProductDetail', { productId: '123' });

// Tab navigator'da sekme değiştirme
navigation.navigate('Search');

// Drawer menüsünü açma
navigation.openDrawer();
```

### Deep Linking

Uygulama aşağıdaki URL formatlarını destekler:

- `chipmost://product/123` - Ürün detayı
- `chipmost://category/electronics` - Kategori listesi
- `chipmost://search/results/phone` - Arama sonuçları

## 🎨 Tasarım

- **Ana Renk**: #007AFF (iOS Blue)
- **Arka Plan**: #FFFFFF (Beyaz)
- **Metin**: #000000 (Siyah)
- **İkincil Metin**: #8E8E93 (Gri)

## 📚 Teknolojiler

- React Native
- Expo
- React Navigation v6
- TypeScript
- React Native Reanimated
- React Native Gesture Handler

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Chipmost Team - [@chipmost](https://twitter.com/chipmost)

Proje Linki: [https://github.com/chipmost/chipmost-mobile-app](https://github.com/chipmost/chipmost-mobile-app)


