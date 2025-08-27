import { PartSearchRequest, PartSearchResponse, SupplierResult } from '../types/partSearch';

// Mock supplier data - gerçek API key'ler olmadan çalışır
const MOCK_SUPPLIERS = [
  {
    name: 'Digi-Key',
    baseUrl: 'https://www.digikey.com',
    searchUrl: 'https://www.digikey.com/en/products/detail/',
  },
  {
    name: 'Mouser',
    baseUrl: 'https://www.mouser.com',
    searchUrl: 'https://www.mouser.com/ProductDetail/',
  },
  {
    name: 'Farnell',
    baseUrl: 'https://uk.farnell.com',
    searchUrl: 'https://uk.farnell.com/',
  },
  {
    name: 'LCSC',
    baseUrl: 'https://www.lcsc.com',
    searchUrl: 'https://www.lcsc.com/product-detail/',
  },
];

// Mock capacitor data - örnek sonuçlar
const MOCK_CAPACITOR_DATA = [
  {
    partNumber: 'STM32F103C8T6',
    description: 'ARM Cortex-M3 32-bit MCU, 64KB Flash, 20KB SRAM, 72MHz',
    stock: 1250,
    moq: 1,
    leadTime: '2-3 hafta',
    price: 2.85,
    currency: 'USD',
  },
  {
    partNumber: 'STM32F103C8T6',
    description: 'STM32F103C8T6 ARM Cortex-M3 Microcontroller',
    stock: 890,
    moq: 5,
    leadTime: '1-2 hafta',
    price: 2.95,
    currency: 'USD',
  },
  {
    partNumber: 'STM32F103C8T6',
    description: 'STM32F103C8T6 MCU ARM Cortex-M3 32-bit',
    stock: 2100,
    moq: 10,
    leadTime: '3-4 hafta',
    price: 2.75,
    currency: 'USD',
  },
  {
    partNumber: 'STM32F103C8T6',
    description: 'STM32F103C8T6 ARM Cortex-M3 32-bit Microcontroller',
    stock: 650,
    moq: 1,
    leadTime: '2-3 hafta',
    price: 2.90,
    currency: 'USD',
  },
];

export class PartSearchService {
  static async searchParts(request: PartSearchRequest): Promise<PartSearchResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const startTime = Date.now();
    
    // Generate mock results for each supplier
    const results: SupplierResult[] = MOCK_SUPPLIERS.map((supplier, index) => {
      const mockData = MOCK_CAPACITOR_DATA[index % MOCK_CAPACITOR_DATA.length];
      
      return {
        supplier: supplier.name,
        partNumber: request.partNumber,
        description: mockData.description,
        stock: mockData.stock + Math.floor(Math.random() * 500),
        moq: mockData.moq,
        leadTime: mockData.leadTime,
        price: mockData.price + (Math.random() - 0.5) * 0.5,
        currency: mockData.currency,
        url: `${supplier.searchUrl}${request.partNumber}`,
      };
    });

    // Add some random variation to make results more realistic
    results.forEach(result => {
      result.stock = Math.max(0, result.stock + Math.floor((Math.random() - 0.5) * 200));
      result.price = Math.max(0.01, result.price + (Math.random() - 0.5) * 0.3);
    });

    // Sort by price (best price first)
    results.sort((a, b) => a.price - b.price);

    return {
      results,
      totalResults: results.length,
      searchTime: Date.now() - startTime,
    };
  }

  static async searchDigiKey(partNumber: string): Promise<SupplierResult[]> {
    // Mock Digi-Key search
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [{
      supplier: 'Digi-Key',
      partNumber,
      description: 'ARM Cortex-M3 32-bit MCU, 64KB Flash, 20KB SRAM, 72MHz',
      stock: 1250,
      moq: 1,
      leadTime: '2-3 hafta',
      price: 2.85,
      currency: 'USD',
      url: `https://www.digikey.com/en/products/detail/${partNumber}`,
    }];
  }

  static async searchMouser(partNumber: string): Promise<SupplierResult[]> {
    // Mock Mouser search
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [{
      supplier: 'Mouser',
      partNumber,
      description: 'STM32F103C8T6 ARM Cortex-M3 Microcontroller',
      stock: 890,
      moq: 5,
      leadTime: '1-2 hafta',
      price: 2.95,
      currency: 'USD',
      url: `https://www.mouser.com/ProductDetail/${partNumber}`,
    }];
  }

  static async searchFarnell(partNumber: string): Promise<SupplierResult[]> {
    // Mock Farnell search
    await new Promise(resolve => setTimeout(resolve, 350));
    
    return [{
      supplier: 'Farnell',
      partNumber,
      description: 'STM32F103C8T6 MCU ARM Cortex-M3 32-bit',
      stock: 2100,
      moq: 10,
      leadTime: '3-4 hafta',
      price: 2.75,
      currency: 'USD',
      url: `https://uk.farnell.com/${partNumber}`,
    }];
  }

  static async searchLCSC(partNumber: string): Promise<SupplierResult[]> {
    // Mock LCSC search
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [{
      supplier: 'LCSC',
      partNumber,
      description: 'STM32F103C8T6 ARM Cortex-M3 32-bit Microcontroller',
      stock: 650,
      moq: 1,
      leadTime: '2-3 hafta',
      price: 2.90,
      currency: 'USD',
      url: `https://www.lcsc.com/product-detail/${partNumber}`,
    }];
  }
}
