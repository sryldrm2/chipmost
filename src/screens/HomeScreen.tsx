import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import SearchPanel from '../components/SearchPanel';
import SearchResults from '../components/SearchResults';
import { PartSearchRequest, PartSearchResponse, SupplierResult } from '../types/partSearch';
import { PartSearchService } from '../services/partSearchService';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SupplierResult[]>([]);
  const [searchTime, setSearchTime] = useState<number>(0);

  const handleSearch = async (request: PartSearchRequest) => {
    setIsLoading(true);
    setSearchResults([]);
    
    try {
      const response: PartSearchResponse = await PartSearchService.searchParts(request);
      setSearchResults(response.results);
      setSearchTime(response.searchTime);
    } catch (error) {
      console.error('Search error:', error);
      // Hata durumunda boş sonuç göster
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Panel */}
        <SearchPanel onSearch={handleSearch} isLoading={isLoading} />
        
        {/* Search Results */}
        <SearchResults 
          results={searchResults}
          isLoading={isLoading}
          searchTime={searchTime}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
