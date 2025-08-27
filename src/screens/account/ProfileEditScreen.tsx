import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

type ProfileEditRouteParams = {
  ProfileEdit: undefined;
};

export default function ProfileEditScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { state: authState } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Geri bildirim state'leri
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');
  
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  // Avatar seçenekleri
  const avatarOptions = [
    { id: 0, name: 'Varsayılan', color: '#0a58ca' },
    { id: 1, name: 'Yeşil', color: '#198754' },
    { id: 2, name: 'Turuncu', color: '#fd7e14' },
    { id: 3, name: 'Mor', color: '#6f42c1' },
    { id: 4, name: 'Pembe', color: '#e83e8c' },
    { id: 5, name: 'Kırmızı', color: '#dc3545' },
  ];

  useEffect(() => {
    if (authState.user) {
      setFirstName(authState.user.firstName);
      setLastName(authState.user.lastName);
      setPhone('+90 555 123 45 67'); // Mock telefon
    }
  }, [authState.user]);

  const validateForm = () => {
    if (!firstName.trim()) {
      setError('Ad gerekli');
      firstNameRef.current?.focus();
      return false;
    }
    
    if (!lastName.trim()) {
      setError('Soyad gerekli');
      lastNameRef.current?.focus();
      return false;
    }
    
    if (!phone.trim()) {
      setError('Telefon numarası gerekli');
      phoneRef.current?.focus();
      return false;
    }
    
    // Basit telefon doğrulama (Türkiye formatı)
    const phoneRegex = /^\+90\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/;
    if (!phoneRegex.test(phone)) {
      setError('Geçerli bir telefon numarası girin (+90 555 123 45 67)');
      phoneRef.current?.focus();
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Mock API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Başarılı!',
        'Profil bilgileriniz kaydedildi.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              navigation.goBack();
            }
          }
        ]
      );
    } catch (err: any) {
      setError(err.message || 'Profil kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Geri bildirim gönder
  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Uyarı', 'Lütfen geri bildiriminizi yazın.');
      return;
    }

    try {
      // Mock API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Teşekkürler!',
        'Geri bildiriminiz alındı. En kısa sürede değerlendirilecek.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              setShowFeedbackModal(false);
              setFeedbackText('');
              setFeedbackType('general');
            }
          }
        ]
      );
    } catch (err: any) {
      Alert.alert('Hata', 'Geri bildirim gönderilemedi. Lütfen tekrar deneyin.');
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Sadece rakamları al
    const numbers = text.replace(/\D/g, '');
    
    // Türkiye telefon formatı: +90 555 123 45 67
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `+${numbers}`;
    if (numbers.length <= 5) return `+${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    if (numbers.length <= 8) return `+${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5)}`;
    if (numbers.length <= 10) return `+${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8)}`;
    if (numbers.length <= 12) return `+${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 10)} ${numbers.slice(10)}`;
    
    return `+${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 8)} ${numbers.slice(8, 10)} ${numbers.slice(10, 12)}`;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const clearError = () => {
    setError('');
  };

  if (!authState.user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.loadingText}>Kullanıcı bilgileri yükleniyor...</Text>
      </View>
    );
  }

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
        
        <Text style={styles.title}>Profili Düzenle</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Error Display */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={clearError} style={styles.errorClose}>
                <Ionicons name="close" size={20} color="#fff" />
              </Pressable>
            </View>
          ) : null}

          {/* Avatar Selection */}
          <View style={styles.avatarSection}>
            <Text style={styles.sectionTitle}>Profil Fotoğrafı</Text>
            <View style={styles.avatarGrid}>
              {avatarOptions.map((avatar) => (
                <Pressable
                  key={avatar.id}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar.id && styles.avatarOptionSelected
                  ]}
                  onPress={() => setSelectedAvatar(avatar.id)}
                  disabled={isLoading}
                >
                  <View style={[styles.avatarPreview, { backgroundColor: avatar.color }]}>
                    <Text style={styles.avatarText}>
                      {authState.user?.firstName.charAt(0)}{authState.user?.lastName.charAt(0)}
                    </Text>
                  </View>
                  {selectedAvatar === avatar.id && (
                    <View style={styles.avatarCheckmark}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ad</Text>
              <TextInput
                ref={firstNameRef}
                style={styles.input}
                placeholder="Adınız"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Soyad</Text>
              <TextInput
                ref={lastNameRef}
                style={styles.input}
                placeholder="Soyadınız"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefon</Text>
              <TextInput
                ref={phoneRef}
                style={styles.input}
                placeholder="+90 555 123 45 67"
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                returnKeyType="done"
                editable={!isLoading}
              />
              <Text style={styles.inputHint}>
                Türkiye telefon formatında girin
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonSection}>
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
                <Text style={styles.saveButtonText}>Kaydet</Text>
              )}
            </Pressable>

            {/* Geri Bildirim Butonu */}
            <Pressable
              style={styles.feedbackButton}
              onPress={() => setShowFeedbackModal(true)}
              disabled={isLoading}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
              <Text style={styles.feedbackButtonText}>Geri Bildirim Gönder</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Profil bilgileriniz güvenli şekilde saklanır
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Geri Bildirim Modal */}
      <Modal
        visible={showFeedbackModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Geri Bildirim</Text>
              <Pressable onPress={() => setShowFeedbackModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </Pressable>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Geri Bildirim Türü</Text>
              <View style={styles.feedbackTypeButtons}>
                {(['bug', 'feature', 'general'] as const).map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.feedbackTypeButton,
                      feedbackType === type && styles.feedbackTypeButtonActive
                    ]}
                    onPress={() => setFeedbackType(type)}
                  >
                    <Text style={[
                      styles.feedbackTypeButtonText,
                      feedbackType === type && styles.feedbackTypeButtonTextActive
                    ]}>
                      {type === 'bug' ? 'Hata Bildirimi' : 
                       type === 'feature' ? 'Özellik Önerisi' : 'Genel Görüş'}
                    </Text>
                  </Pressable>
                ))}
              </View>
              
              <Text style={styles.modalLabel}>Mesajınız *</Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Görüşlerinizi veya önerilerinizi yazın..."
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => setShowFeedbackModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Vazgeç</Text>
              </Pressable>
              
              <Pressable
                style={styles.modalSubmitButton}
                onPress={handleSendFeedback}
              >
                <Text style={styles.modalSubmitButtonText}>Gönder</Text>
              </Pressable>
            </View>
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
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  errorClose: {
    padding: 4,
  },
  avatarSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  avatarOption: {
    alignItems: 'center',
    position: 'relative',
  },
  avatarOptionSelected: {
    transform: [{ scale: 1.1 }],
  },
  avatarPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  avatarCheckmark: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#198754',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  inputHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonSection: {
    marginBottom: 24,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  feedbackButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
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
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  modalBody: {
    gap: 16,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  feedbackTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackTypeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  feedbackTypeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  feedbackTypeButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  feedbackTypeButtonTextActive: {
    color: '#fff',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#f8f9fa',
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});