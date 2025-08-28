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

export default function SignInScreen() {
  const navigation = useNavigation<any>();
  const { signIn } = useAuth();
  const { colors } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const validateForm = () => {
    if (!email.trim()) {
      setError('E-posta adresi gerekli');
      emailRef.current?.focus();
      return false;
    }
    
    if (!password.trim()) {
      setError('Parola gerekli');
      passwordRef.current?.focus();
      return false;
    }
    
    // Basit e-posta doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir e-posta adresi girin');
      emailRef.current?.focus();
      return false;
    }
    
    if (password.length < 6) {
      setError('Parola en az 6 karakter olmalı');
      passwordRef.current?.focus();
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm() || isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await signIn({ email: email.trim(), password });
      
      if (success) {
        // Başarılı giriş - Account Home'a yönlendir
        navigation.reset({
          index: 0,
          routes: [{ name: 'AccountHome' }]
        });
      } else {
        // Hata mesajı authService'den gelir
        setError('E-posta veya parola hatalı');
      }
    } catch (err: any) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior="padding">
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Hoş Geldiniz</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Chipmost hesabınıza giriş yapın</Text>
        </View>

        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: colors.error }]}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={clearError} style={styles.errorClose}>
              <Ionicons name="close" size={20} color={colors.buttonText} />
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
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Parola</Text>
            <View style={[styles.passwordContainer, { 
              borderColor: colors.border, 
              backgroundColor: colors.surface 
            }]}>
              <TextInput
                ref={passwordRef}
                style={[styles.passwordInput, { color: colors.text }]}
                placeholder="Parolanızı girin"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                editable={!isLoading}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
            disabled={isLoading}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Parolamı unuttum</Text>
          </Pressable>

          <Pressable
            style={[
              styles.signInButton,
              { backgroundColor: colors.primary },
              (!email.trim() || !password.trim() || isLoading) && styles.signInButtonDisabled
            ]}
            onPress={handleSignIn}
            disabled={!email.trim() || !password.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.buttonText} size="small" />
            ) : (
              <Text style={[styles.signInButtonText, { color: colors.buttonText }]}>Giriş Yap</Text>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>veya</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
          </View>

          <Pressable
            style={[styles.signUpButton, { 
              borderColor: colors.border,
              backgroundColor: colors.surface
            }]}
            onPress={() => navigation.navigate('SignUp')}
            disabled={isLoading}
          >
            <Text style={[styles.signUpButtonText, { color: colors.text }]}>Hesap Oluştur</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Demo hesap: demo@chipmost.com / demo123
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  signInButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signInButtonText: {
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
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  signUpButton: {
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

