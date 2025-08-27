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

export default function SignUpScreen() {
  const navigation = useNavigation<any>();
  const { signUp } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

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
    
    if (!password.trim()) {
      setError('Parola gerekli');
      passwordRef.current?.focus();
      return false;
    }
    
    if (password.length < 6) {
      setError('Parola en az 6 karakter olmalı');
      passwordRef.current?.focus();
      return false;
    }
    
    if (!confirmPassword.trim()) {
      setError('Parola doğrulama gerekli');
      confirmPasswordRef.current?.focus();
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Parolalar eşleşmiyor');
      confirmPasswordRef.current?.focus();
      return false;
    }
    
    if (!acceptTerms) {
      setError('Şartları kabul etmelisiniz');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm() || isLoading) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        acceptTerms
      });
      
      if (success) {
        // Başarılı kayıt - Account Home'a yönlendir
        Alert.alert(
          'Başarılı!',
          'Hesabınız oluşturuldu ve giriş yapıldı.',
          [
            {
              text: 'Tamam',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'AccountHome' }]
                });
              }
            }
          ]
        );
      } else {
        // Hata mesajı authService'den gelir
        setError('Bu e-posta adresi zaten kayıtlı');
      }
    } catch (err: any) {
      setError(err.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError('');

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Hesap Oluştur</Text>
          <Text style={styles.subtitle}>Chipmost'a katılmak için bilgilerinizi girin</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={clearError} style={styles.errorClose}>
              <Ionicons name="close" size={20} color="#fff" />
            </Pressable>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
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
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Soyad</Text>
              <TextInput
                ref={lastNameRef}
                style={styles.input}
                placeholder="Soyadınız"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-posta</Text>
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="ornek@email.com"
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
            <Text style={styles.label}>Parola</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                ref={passwordRef}
                style={styles.passwordInput}
                placeholder="En az 6 karakter"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
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
                  color="#666"
                />
              </Pressable>
            </View>
            <Text style={styles.passwordHint}>
              En az 6 karakter, sayı ve harf kombinasyonu
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Parola Doğrulama</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                ref={confirmPasswordRef}
                style={styles.passwordInput}
                placeholder="Parolanızı tekrar girin"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                returnKeyType="done"
                editable={!isLoading}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#666"
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.termsContainer}>
            <Pressable
              style={styles.checkbox}
              onPress={() => setAcceptTerms(!acceptTerms)}
              disabled={isLoading}
            >
              <Ionicons
                name={acceptTerms ? 'checkbox' : 'square-outline'}
                size={20}
                color={acceptTerms ? '#0a58ca' : '#666'}
              />
            </Pressable>
            <Text style={styles.termsText}>
              <Text style={styles.termsLink}>Kullanım şartlarını</Text> ve{' '}
              <Text style={styles.termsLink}>gizlilik politikasını</Text> kabul ediyorum
            </Text>
          </View>

          <Pressable
            style={[
              styles.signUpButton,
              (!firstName.trim() || !lastName.trim() || !email.trim() || 
               !password.trim() || !confirmPassword.trim() || !acceptTerms || isLoading) && 
               styles.signUpButtonDisabled
            ]}
            onPress={handleSignUp}
            disabled={!firstName.trim() || !lastName.trim() || !email.trim() || 
                     !password.trim() || !confirmPassword.trim() || !acceptTerms || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signUpButtonText}>Hesap Oluştur</Text>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={styles.signInButton}
            onPress={() => navigation.navigate('SignIn')}
            disabled={isLoading}
          >
            <Text style={styles.signInButtonText}>Zaten hesabım var</Text>
          </Pressable>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  form: {
    gap: 20,
  },
  nameRow: {
    flexDirection: 'row',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e3e3e7',
    borderRadius: 8,
    backgroundColor: '#fff',
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
  passwordHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    padding: 4,
    marginTop: 2,
  },
  termsText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: '#0a58ca',
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signUpButtonText: {
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
  signInButton: {
    borderWidth: 1,
    borderColor: '#111',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
});

