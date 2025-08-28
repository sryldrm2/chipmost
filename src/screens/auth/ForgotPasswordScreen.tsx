import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const { forgotPassword } = useAuth();
  const { colors } = useTheme();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const emailRef = useRef<TextInput>(null);

  const validateForm = () => {
    if (!email.trim()) {
      setError('E-posta adresi gerekli');
      emailRef.current?.focus();
      return false;
    }
    
    // Basit e-posta doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir e-posta adresi girin');
      emailRef.current?.focus();
      return false;
    }
    
    setError('');
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateForm() || isLoading) return;
    
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const successResult = await forgotPassword({ email: email.trim() });
      
      if (successResult) {
        setSuccess(true);
        setEmail('');
      } else {
        setError('Bu e-posta adresi sistemde kayıtlı değil');
      }
    } catch (err: any) {
      setError(err.message || 'Şifre sıfırlama talebi gönderilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');
  const clearSuccess = () => setSuccess(false);

  const handleBackToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior="padding">
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={handleBackToSignIn}
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          
          <Text style={[styles.title, { color: colors.text }]}>Şifremi Unuttum</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim
          </Text>
        </View>

        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: colors.errorBackground }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            <Pressable onPress={clearError} style={styles.errorClose}>
              <Ionicons name="close" size={20} color={colors.buttonText} />
            </Pressable>
          </View>
        ) : null}

        {success ? (
          <View style={[styles.successContainer, { backgroundColor: colors.successBackground }]}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={[styles.successText, { color: colors.success }]}>
              Şifre sıfırlama bağlantısı e-posta adresinize gönderildi
            </Text>
            <Pressable onPress={clearSuccess} style={styles.successClose}>
              <Ionicons name="close" size={20} color={colors.success} />
            </Pressable>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>E-posta</Text>
            <TextInput
              ref={emailRef}
              style={[styles.input, { 
                borderColor: colors.border, 
                backgroundColor: colors.surface,
                color: colors.text 
              }]}
              placeholder="ornek@email.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleForgotPassword}
              editable={!isLoading}
            />
          </View>

          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary },
              (!email.trim() || isLoading) && styles.submitButtonDisabled
            ]}
            onPress={handleForgotPassword}
            disabled={!email.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.buttonText} size="small" />
            ) : (
              <Text style={[styles.submitButtonText, { color: colors.buttonText }]}>Sıfırlama Bağlantısı Gönder</Text>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>veya</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
          </View>

          <Pressable
            style={[styles.backToSignInButton, { 
              borderColor: colors.border,
              backgroundColor: colors.surface
            }]}
            onPress={handleBackToSignIn}
            disabled={isLoading}
          >
            <Text style={[styles.backToSignInButtonText, { color: colors.text }]}>Giriş Ekranına Dön</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            E-posta gelmedi mi? Spam klasörünü kontrol edin
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  errorClose: {
    padding: 4,
  },
  successContainer: {
    backgroundColor: '#d4edda',
    borderWidth: 1,
    borderColor: '#c3e6cb',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  successText: {
    color: '#155724',
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
  },
  successClose: {
    padding: 4,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
  submitButton: {
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e3e3e7',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  backToSignInButton: {
    borderWidth: 1,
    borderColor: '#111',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backToSignInButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});

