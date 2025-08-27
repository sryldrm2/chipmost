import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ScrollView,
  Alert,
  Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchResultCard from './SearchResultCard';

// Mock arama sonuçları - gerçek projede API'den gelecek
const MOCK_SEARCH_RESULTS = [
  {
    id: 'SR001',
    title: 'RJ45 Cat6 Konnektör',
    description: 'Yüksek performanslı Cat6 ethernet konnektörü, 1Gbps hız desteği ile profesyonel kullanım için ideal.',
    category: 'Konnektörler',
    price: 15.99,
    inStock: true
  },
  {
    id: 'SR002',
    title: 'USB-C Kablo 2m',
    description: 'USB Type-C kablo, hızlı veri transferi ve şarj desteği. 2 metre uzunluk.',
    category: 'Kablolar',
    price: 12.50,
    inStock: true
  },
  {
    id: 'SR003',
    title: 'Kelepçe 15-25mm',
    description: 'Ayarlanabilir kelepçe, 15-25mm çap aralığında kullanım. Endüstriyel kalite.',
    category: 'Aksesuarlar',
    price: 8.75,
    inStock: false
  },
  {
    id: 'SR004',
    title: 'Kablo Soyucu',
    description: 'Çok fonksiyonlu kablo soyucu, 3 farklı boyutta kesim yapabilir.',
    category: 'Araçlar',
    price: 25.00,
    inStock: true
  },
  {
    id: 'SR005',
    title: 'HDMI 2.1 Konnektör',
    description: '8K video desteği ile HDMI 2.1 konnektör, yüksek çözünürlük uyumlu.',
    category: 'Konnektörler',
    price: 45.99,
    inStock: true
  }
];

const CATEGORIES = ['Tümü', 'Konnektörler', 'Kablolar', 'Aksesuarlar', 'Araçlar'];

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof MOCK_SEARCH_RESULTS>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Filtre state'leri
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  
  // Modal state'leri
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Uyarı', 'Lütfen arama terimi girin.');
      return;
    }

    setIsSearching(true);
    
    // Mock arama simülasyonu
    setTimeout(() => {
      let filteredResults = MOCK_SEARCH_RESULTS.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Kategori filtresi
      if (selectedCategory !== 'Tümü') {
        filteredResults = filteredResults.filter(item => item.category === selectedCategory);
      }
      
      // Fiyat filtresi
      filteredResults = filteredResults.filter(item => 
        item.price >= priceRange.min && item.price <= priceRange.max
      );
      
      // Stok filtresi
      if (stockFilter === 'inStock') {
        filteredResults = filteredResults.filter(item => item.inStock);
      } else if (stockFilter === 'outOfStock') {
        filteredResults = filteredResults.filter(item => !item.inStock);
      }
      
      setSearchResults(filteredResults);
      setIsSearching(false);
      
      if (filteredResults.length === 0) {
        Alert.alert('Sonuç Yok', 'Arama kriterlerinize uygun sonuç bulunamadı.');
      }
    }, 1000);
  };

  const handleResultPress = (result: typeof MOCK_SEARCH_RESULTS[0]) => {
    // İleride ProductDetail'e yönlenecek
    Alert.alert('Ürün Detayı', `${result.title} detay sayfası açılacak.`);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryModal(false);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0;
    setPriceRange(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const handleStockFilter = (filter: 'all' | 'inStock' | 'outOfStock') => {
    setStockFilter(filter);
    setShowStockModal(false);
  };

  const clearFilters = () => {
    setSelectedCategory('Tümü');
    setPriceRange({ min: 0, max: 100 });
    setStockFilter('all');
  };

  const renderSearchResult = ({ item }: { item: typeof MOCK_SEARCH_RESULTS[0] }) => (
    <SearchResultCard
      id={item.id}
      title={item.title}
      description={item.description}
      category={item.category}
      price={item.price}
      inStock={item.inStock}
      onPress={() => handleResultPress(item)}
    />
  );

  const getItemLayout = (data: any, index: number) => ({
    length: 100, // Approximate height of each item
    offset: 100 * index,
    index,
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Arama</Text>
        <Text style={styles.headerSubtitle}>Ürün ve kategorilerde arama yapın</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ürün adı, kategori veya açıklama..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={isSearching}
          >
            <Text style={styles.searchButtonText}>
              {isSearching ? 'Aranıyor...' : 'Ara'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <Text style={styles.sectionTitle}>Filtreler</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Temizle</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              selectedCategory !== 'Tümü' && styles.filterButtonActive
            ]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedCategory !== 'Tümü' && styles.filterButtonTextActive
            ]}>
              {selectedCategory}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              (priceRange.min > 0 || priceRange.max < 100) && styles.filterButtonActive
            ]}
            onPress={() => setShowPriceModal(true)}
          >
            <Text style={[
              styles.filterButtonText,
              (priceRange.min > 0 || priceRange.max < 100) && styles.filterButtonTextActive
            ]}>
              ₺{priceRange.min}-{priceRange.max}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              stockFilter !== 'all' && styles.filterButtonActive
            ]}
            onPress={() => setShowStockModal(true)}
          >
            <Text style={[
              styles.filterButtonText,
              stockFilter !== 'all' && styles.filterButtonTextActive
            ]}>
              {stockFilter === 'all' ? 'Stok' : stockFilter === 'inStock' ? 'Stokta' : 'Stok Yok'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Results Section */}
      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>
          Arama Sonuçları ({searchResults.length})
        </Text>
        
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsList}
            getItemLayout={getItemLayout}
            windowSize={5}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={5}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Arama yapın veya filtreleri kullanın' : 'Arama yapmak için yukarıdaki alanı kullanın'}
            </Text>
          </View>
        )}
      </View>

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kategori Seç</Text>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.modalOption,
                  selectedCategory === category && styles.modalOptionSelected
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedCategory === category && styles.modalOptionTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Price Modal */}
      <Modal
        visible={showPriceModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fiyat Aralığı</Text>
            <View style={styles.priceInputContainer}>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Min:</Text>
                <TextInput
                  style={styles.priceTextInput}
                  value={priceRange.min.toString()}
                  onChangeText={(value) => handlePriceChange('min', value)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={styles.priceInput}>
                <Text style={styles.priceLabel}>Max:</Text>
                <TextInput
                  style={styles.priceTextInput}
                  value={priceRange.max.toString()}
                  onChangeText={(value) => handlePriceChange('max', value)}
                  keyboardType="numeric"
                  placeholder="100"
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPriceModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Stock Modal */}
      <Modal
        visible={showStockModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Stok Durumu</Text>
            <TouchableOpacity
              style={[
                styles.modalOption,
                stockFilter === 'all' && styles.modalOptionSelected
              ]}
              onPress={() => handleStockFilter('all')}
            >
              <Text style={[
                styles.modalOptionText,
                stockFilter === 'all' && styles.modalOptionTextSelected
              ]}>
                Tümü
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalOption,
                stockFilter === 'inStock' && styles.modalOptionSelected
              ]}
              onPress={() => handleStockFilter('inStock')}
            >
              <Text style={[
                styles.modalOptionText,
                stockFilter === 'inStock' && styles.modalOptionTextSelected
              ]}>
                Stokta Olanlar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalOption,
                stockFilter === 'outOfStock' && styles.modalOptionSelected
              ]}
              onPress={() => handleStockFilter('outOfStock')}
            >
              <Text style={[
                styles.modalOptionText,
                stockFilter === 'outOfStock' && styles.modalOptionTextSelected
              ]}>
                Stokta Olmayanlar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowStockModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  
  searchSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  filterSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  clearFiltersText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  
  resultsSection: {
    flex: 1,
    padding: 20,
  },
  resultsList: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  modalOptionSelected: {
    backgroundColor: '#007AFF',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  modalCloseButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Price Input Styles
  priceInputContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceTextInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
