import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { PartSearchRequest } from '../types/partSearch';

interface SearchPanelProps {
  onSearch: (request: PartSearchRequest) => void;
  isLoading: boolean;
}

export default function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [partNumber, setPartNumber] = useState('');
  const [quantity, setQuantity] = useState('1');
  const { colors } = useTheme();

  const handleSearch = () => {
    if (!partNumber.trim()) return;
    
    const searchRequest: PartSearchRequest = {
      partNumber: partNumber.trim(),
      quantity: parseInt(quantity) || 1,
    };
    
    onSearch(searchRequest);
  };

  const isValidSearch = partNumber.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Ana Sayfa</Text>
        <Text style={styles.heroSubtitle}>
          Digi-Key, Mouser, Farnell ve LCSC'de parça numarası ile arama yapın
        </Text>
      </View>

      {/* Search Form */}
      <View style={[styles.searchForm, { backgroundColor: colors.card }]}>
        {/* Part Number Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Parça Numarası (MPN)</Text>
          <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
            <Ionicons 
              name="search" 
              size={20} 
              color={colors.textSecondary} 
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="Örn: STM32F103C8T6"
              placeholderTextColor={colors.textSecondary}
              value={partNumber}
              onChangeText={setPartNumber}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Quantity Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Miktar</Text>
          <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
            <Ionicons 
              name="cube" 
              size={20} 
              color={colors.textSecondary} 
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="1"
              placeholderTextColor={colors.textSecondary}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            { 
              backgroundColor: isValidSearch ? colors.accent : colors.textSecondary,
              opacity: isValidSearch ? 1 : 0.6,
            }
          ]}
          onPress={handleSearch}
          disabled={!isValidSearch || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.searchButtonText}>Ara</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  searchForm: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
