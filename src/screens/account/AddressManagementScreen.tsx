import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Address = {
  id: string;
  title: string;
  city: string;
  district: string;
  postalCode: string;
  detail: string;
  isDefault: boolean;
};

export default function AddressManagementScreen() {
  const navigation = useNavigation<any>();
  
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      title: 'Ev',
      city: 'İstanbul',
      district: 'Kadıköy',
      postalCode: '34710',
      detail: 'Atatürk Mah. Cumhuriyet Cad. No:123 D:4',
      isDefault: true
    },
    {
      id: '2',
      title: 'İş',
      city: 'İstanbul',
      district: 'Beşiktaş',
      postalCode: '34353',
      detail: 'Levent Mah. Büyükdere Cad. No:45 Kat:12',
      isDefault: false
    }
  ]);
  
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [detail, setDetail] = useState('');

  const clearForm = () => {
    setTitle('');
    setCity('');
    setDistrict('');
    setPostalCode('');
    setDetail('');
    setError('');
  };

  const openAddModal = () => {
    clearForm();
    setIsAddModalVisible(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setTitle(address.title);
    setCity(address.city);
    setDistrict(address.district);
    setPostalCode(address.postalCode);
    setDetail(address.detail);
    setIsEditModalVisible(true);
  };

  const closeModals = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setEditingAddress(null);
    clearForm();
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Adres başlığı gerekli');
      return false;
    }
    
    if (!city.trim()) {
      setError('Şehir gerekli');
      return false;
    }
    
    if (!district.trim()) {
      setError('İlçe gerekli');
      return false;
    }
    
    if (!postalCode.trim()) {
      setError('Posta kodu gerekli');
      return false;
    }
    
    if (!detail.trim()) {
      setError('Detay adres gerekli');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Mock API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingAddress) {
        // Düzenleme
        const updatedAddresses = addresses.map(addr => 
          addr.id === editingAddress.id 
            ? { ...addr, title, city, district, postalCode, detail }
            : addr
        );
        setAddresses(updatedAddresses);
        Alert.alert('Başarılı!', 'Adres güncellendi.');
      } else {
        // Yeni ekleme
        const newAddress: Address = {
          id: Date.now().toString(),
          title: title.trim(),
          city: city.trim(),
          district: district.trim(),
          postalCode: postalCode.trim(),
          detail: detail.trim(),
          isDefault: addresses.length === 0 // İlk adres varsayılan olsun
        };
        
        setAddresses([...addresses, newAddress]);
        Alert.alert('Başarılı!', 'Yeni adres eklendi.');
      }
      
      closeModals();
    } catch (err: any) {
      setError(err.message || 'Adres kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (address: Address) => {
    Alert.alert(
      'Adresi Sil',
      `"${address.title}" adresini silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            const updatedAddresses = addresses.filter(addr => addr.id !== address.id);
            setAddresses(updatedAddresses);
            
            // Eğer silinen adres varsayılan ise, ilk adresi varsayılan yap
            if (address.isDefault && updatedAddresses.length > 0) {
              const newDefault = updatedAddresses[0];
              newDefault.isDefault = true;
              setAddresses([newDefault, ...updatedAddresses.slice(1)]);
            }
          }
        }
      ]
    );
  };

  const setDefaultAddress = (address: Address) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === address.id
    }));
    setAddresses(updatedAddresses);
  };

  const renderAddressCard = (address: Address) => (
    <View key={address.id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTitleRow}>
          <Text style={styles.addressTitle}>{address.title}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Varsayılan</Text>
            </View>
          )}
        </View>
        <View style={styles.addressActions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => openEditModal(address)}
          >
            <Ionicons name="create-outline" size={20} color="#0a58ca" />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => handleDelete(address)}
          >
            <Ionicons name="trash-outline" size={20} color="#dc3545" />
          </Pressable>
        </View>
      </View>
      
      <View style={styles.addressContent}>
        <Text style={styles.addressText}>
          {address.district}, {address.city} {address.postalCode}
        </Text>
        <Text style={styles.addressDetail}>{address.detail}</Text>
      </View>
      
      {!address.isDefault && (
        <Pressable
          style={styles.setDefaultButton}
          onPress={() => setDefaultAddress(address)}
        >
          <Text style={styles.setDefaultButtonText}>Varsayılan Yap</Text>
        </Pressable>
      )}
    </View>
  );

  const renderModal = () => (
    <Modal
      visible={isAddModalVisible || isEditModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable onPress={closeModals} style={styles.modalCloseButton}>
            <Ionicons name="close" size={24} color="#111" />
          </Pressable>
          <Text style={styles.modalTitle}>
            {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => setError('')} style={styles.errorClose}>
              <Ionicons name="close" size={20} color="#fff" />
            </Pressable>
          </View>
        ) : null}

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adres Başlığı</Text>
            <TextInput
              style={styles.input}
              placeholder="Ev, İş, vs."
              value={title}
              onChangeText={setTitle}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şehir</Text>
            <TextInput
              style={styles.input}
              placeholder="İstanbul"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>İlçe</Text>
            <TextInput
              style={styles.input}
              placeholder="Kadıköy"
              value={district}
              onChangeText={setDistrict}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Posta Kodu</Text>
            <TextInput
              style={styles.input}
              placeholder="34710"
              value={postalCode}
              onChangeText={setPostalCode}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Detay Adres</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mahalle, sokak, bina no, kat, daire no"
              value={detail}
              onChangeText={setDetail}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <Pressable
            style={styles.cancelButton}
            onPress={closeModals}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>İptal</Text>
          </Pressable>
          
          <Pressable
            style={[
              styles.saveButton,
              isLoading && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>
                {editingAddress ? 'Güncelle' : 'Ekle'}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </Pressable>
        
        <Text style={styles.title}>Adreslerim</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Add Address Button */}
      <View style={styles.addButtonSection}>
        <Pressable style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Adres Ekle</Text>
        </Pressable>
      </View>

      {/* Address List */}
      <ScrollView style={styles.addressList} contentContainerStyle={styles.addressListContent}>
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>Henüz adres eklenmemiş</Text>
            <Text style={styles.emptyStateText}>
              İlk adresinizi ekleyerek başlayın
            </Text>
          </View>
        ) : (
          addresses.map(renderAddressCard)
        )}
      </ScrollView>

      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  addButtonSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  addressList: {
    flex: 1,
  },
  addressListContent: {
    padding: 24,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  defaultBadge: {
    backgroundColor: '#198754',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  addressContent: {
    marginBottom: 16,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  addressDetail: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#0a58ca',
    borderRadius: 8,
  },
  setDefaultButtonText: {
    color: '#0a58ca',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e7',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e3e3e7',
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e3e3e7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorContainer: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  errorClose: {
    padding: 4,
  },
});
