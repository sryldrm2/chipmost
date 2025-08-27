import { Product } from '../../types/product';

export const PRODUCTS: Product[] = [
  { 
    id: 'SR001', 
    name: 'RJ45 Cat6 Konnektör', 
    category: 'Konnektörler', 
    description: 'Yüksek performanslı Cat6 ethernet konnektörü, 1Gbps hız desteği ile profesyonel kullanım için ideal. Gold plated contacts ile uzun ömürlü bağlantı garantisi.', 
    price: 0.48, 
    currency: 'USD', 
    inStock: true, 
    stockQty: 1250,
    mpn: 'RJ45-CAT6-GOLD',
    moq: 10
  },
  { 
    id: 'SR002', 
    name: 'USB-C Kablo 2m', 
    category: 'Kablolar', 
    description: 'USB Type-C kablo, hızlı veri transferi ve şarj desteği. 2 metre uzunluk. 100W güç aktarımı ve 10Gbps veri hızı desteği.', 
    price: 0.38, 
    currency: 'USD', 
    inStock: true, 
    stockQty: 2152,
    mpn: 'USB-C-2M-100W',
    moq: 5
  },
  { 
    id: 'SR003', 
    name: 'Kelepçe 15-25mm', 
    category: 'Aksesuarlar', 
    description: 'Ayarlanabilir kelepçe, 15-25mm çap aralığında kullanım. Endüstriyel kalite, paslanmaz çelik malzeme. Sıkma gücü: 50N.', 
    price: 0.27, 
    currency: 'USD', 
    inStock: false, 
    stockQty: 0,
    mpn: 'KL-15-25-SS',
    moq: 20
  },
  { 
    id: 'SR004', 
    name: 'Kablo Soyucu', 
    category: 'Araçlar', 
    description: 'Çok fonksiyonlu kablo soyucu, 3 farklı boyutta kesim yapabilir. Ergonomik tasarım, güvenli kullanım. 0.5mm - 2.5mm arası kablo kalınlıkları için.', 
    price: 0.76, 
    currency: 'USD', 
    inStock: true, 
    stockQty: 89,
    mpn: 'KS-MULTI-3',
    moq: 1
  },
  { 
    id: 'SR005', 
    name: 'HDMI 2.1 Konnektör', 
    category: 'Konnektörler', 
    description: '8K video desteği ile HDMI 2.1 konnektör, yüksek çözünürlük uyumlu. 48Gbps bant genişliği, HDR desteği. Gold plated contacts.', 
    price: 1.39, 
    currency: 'USD', 
    inStock: true, 
    stockQty: 156,
    mpn: 'HDMI-2.1-8K',
    moq: 5
  },
  {
    id: 'STM32F103C8T6', 
    name: 'STM32F103C8T6 MCU', 
    category: 'Mikrodenetleyiciler', 
    description: 'ARM Cortex-M3 32-bit MCU, 72MHz çalışma hızı, 64KB Flash, 20KB SRAM. LQFP48 paket. Geniş periferi desteği ile IoT projeleri için ideal.', 
    price: 2.69, 
    currency: 'USD', 
    inStock: true, 
    stockQty: 4200, 
    mpn: 'STM32F103C8T6',
    moq: 1
  },
  {
    id: 'ESP32-WROOM-32', 
    name: 'ESP32-WROOM-32 Dev Board', 
    category: 'Geliştirme Kartları', 
    description: 'WiFi + Bluetooth entegre ESP32 geliştirme kartı. Dual-core 240MHz, 4MB Flash, 520KB SRAM. Arduino ve MicroPython desteği.', 
    price: 8.99, 
    currency: 'USD', 
    inStock: true, 
    stockQty: 1250,
    mpn: 'ESP32-WROOM-32',
    moq: 1
  },
  {
    id: 'ARDUINO-UNO-R3', 
    name: 'Arduino Uno R3', 
    category: 'Geliştirme Kartları', 
    description: 'Klasik Arduino Uno R3 geliştirme kartı. ATmega328P mikrodenetleyici, 14 dijital I/O pin, 6 analog input. USB bağlantı ve DC power jack.', 
    price: 12.99, 
    currency: 'USD', 
    inStock: true, 
    stockQty: 850,
    mpn: 'A000066',
    moq: 1
  },
  {
    id: 'LED-RGB-5MM', 
    name: 'RGB LED 5mm', 
    category: 'Aksesuarlar', 
    description: '5mm RGB LED, 3 renk (Kırmızı, Yeşil, Mavi) tek pakette. Ortak anot veya katot. Parlak ışık çıkışı. Proje ve dekoratif kullanım için ideal.', 
    price: 0.75, 
    currency: 'USD', 
    inStock: true, 
    stockQty: 5000,
    mpn: 'LED-RGB-5MM-COM',
    moq: 50
  },
  {
    id: 'RESISTOR-220OHM', 
    name: 'Direnç 220Ω 1/4W', 
    category: 'Aksesuarlar', 
    description: 'Metal film direnç, 220 ohm, 1/4 watt güç. %5 tolerans. Yüksek kalite, düşük gürültü. Elektronik projeler için temel bileşen.', 
    price: 0.05, 
    currency: 'USD', 
    inStock: true, 
    stockQty: 10000,
    mpn: 'RES-220-1/4W',
    moq: 100
  }
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description?.toLowerCase().includes(lowerQuery) ||
    product.category?.toLowerCase().includes(lowerQuery) ||
    product.mpn?.toLowerCase().includes(lowerQuery)
  );
}
