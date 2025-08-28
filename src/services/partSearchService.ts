import { PartSearchRequest, PartSearchResponse, SupplierResult, PartSearchResult } from '../types/partSearch';

// Mock data for demonstration
const MOCK_PRODUCTS: PartSearchResult[] = [
  {
    id: 'SR001',
    name: 'RF Connector SMA Male',
    description: 'High-quality SMA male connector for RF applications',
    price: 2.99,
    currency: 'USD',
    inStock: true,
    stockQty: 150,
    category: 'connectors',
    mpn: 'SMA-M-001',
    moq: 10
  },
  {
    id: 'SR002',
    name: 'BNC Connector Female',
    description: 'BNC female connector with gold plating',
    price: 1.99,
    currency: 'USD',
    inStock: true,
    stockQty: 200,
    category: 'connectors',
    mpn: 'BNC-F-002',
    moq: 25
  },
  {
    id: 'SR003',
    name: 'Coaxial Cable RG58',
    description: 'RG58 coaxial cable, 1 meter length',
    price: 0.99,
    currency: 'USD',
    inStock: true,
    stockQty: 500,
    category: 'cables',
    mpn: 'RG58-1M',
    moq: 100
  },
  {
    id: 'SR004',
    name: 'PCB Board 10x15cm',
    description: 'Double-sided PCB board, 10x15cm dimensions',
    price: 5.99,
    currency: 'USD',
    inStock: false,
    stockQty: 0,
    category: 'boards',
    mpn: 'PCB-10x15',
    moq: 5
  },
  {
    id: 'SR005',
    name: 'LED Strip 5m',
    description: 'RGB LED strip, 5 meters, 60 LEDs/m',
    price: 15.99,
    currency: 'USD',
    inStock: true,
    stockQty: 50,
    category: 'lighting',
    mpn: 'LED-5M-RGB',
    moq: 1
  }
];

export class PartSearchService {
  static async searchParts(request: PartSearchRequest): Promise<PartSearchResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    let filteredResults = [...MOCK_PRODUCTS];
    
    // Apply filters
    if (request.query) {
      const query = request.query.toLowerCase();
      filteredResults = filteredResults.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }
    
    if (request.category) {
      filteredResults = filteredResults.filter(product =>
        product.category === request.category
      );
    }
    
    if (request.minPrice !== undefined) {
      filteredResults = filteredResults.filter(product =>
        product.price >= request.minPrice!
      );
    }
    
    if (request.maxPrice !== undefined) {
      filteredResults = filteredResults.filter(product =>
        product.price <= request.maxPrice!
      );
    }
    
    if (request.inStock !== undefined) {
      filteredResults = filteredResults.filter(product =>
        product.inStock === request.inStock
      );
    }
    
    // Group by supplier (mock)
    const supplierResults: SupplierResult[] = [
      {
        supplierName: 'Mouser Electronics',
        results: filteredResults.slice(0, Math.ceil(filteredResults.length / 2))
      },
      {
        supplierName: 'LCSC Electronics',
        results: filteredResults.slice(Math.ceil(filteredResults.length / 2))
      }
    ];
    
    return {
      results: supplierResults,
      searchTime: Math.floor(Math.random() * 200) + 100,
      totalResults: filteredResults.length
    };
  }
}


