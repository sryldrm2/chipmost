import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

export default function AccountHomeScreen() {
  const { state, signOut } = useAuth();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const handleSignOut = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Çıkış sonrası SignIn ekranına yönlendir
              // Bu navigation işlemi AuthContext'te yapılacak
            } catch (error) {
              console.error('Sign out error:', error);
            }
          }
        }
      ]
    );
  };

  const handleManageAccount = () => {
    Alert.alert(
      'Hesap Yönetimi',
      'Bu özellik gelecek günlerde eklenecek.',
      [{ text: 'Tamam', style: 'default' }]
    );
  };

  const handleOrderHistory = () => {
    navigation.navigate('OrderHistory');
  };

  const handleAddresses = () => {
    navigation.navigate('AddressManagement');
  };

  const handlePaymentMethods = () => {
    Alert.alert(
      'Ödeme Yöntemleri',
      'Bu özellik gelecek günlerde eklenecek.',
      [{ text: 'Tamam', style: 'default' }]
    );
  };

  if (state.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!state.user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#dc3545" />
        <Text style={styles.errorTitle}>Kullanıcı bilgisi bulunamadı</Text>
        <Text style={styles.errorText}>
          Lütfen tekrar giriş yapmayı deneyin.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.buttonText }]}>
            {state.user.firstName.charAt(0)}{state.user.lastName.charAt(0)}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>{state.user.fullName}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{state.user.email}</Text>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>Hoş geldiniz! 👋</Text>
        <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
          Chipmost hesabınızı yönetin ve siparişlerinizi takip edin.
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Hızlı İşlemler</Text>
        <View style={styles.quickActions}>
          <Pressable style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handleOrderHistory}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="receipt" size={24} color={colors.buttonText} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Sipariş Geçmişi</Text>
          </Pressable>
          
          <Pressable style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handleAddresses}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.success }]}>
              <Ionicons name="location" size={24} color={colors.buttonText} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Adreslerim</Text>
          </Pressable>
          
          <Pressable style={[styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={handlePaymentMethods}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.warning }]}>
              <Ionicons name="card" size={24} color={colors.buttonText} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Ödeme Yöntemleri</Text>
          </Pressable>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Hesap Ayarları</Text>
        
        <Pressable style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate('ProfileEdit')}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="person" size={20} color={colors.textSecondary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Profil Bilgileri</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
        
        <Pressable style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications" size={20} color={colors.textSecondary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Bildirim Ayarları</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
        
        <Pressable style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="shield-checkmark" size={20} color={colors.textSecondary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Güvenlik</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
        
        <Pressable style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="help-circle" size={20} color={colors.textSecondary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Yardım & Destek</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
        
        <Pressable style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate('ThemeSettings')}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="color-palette" size={20} color={colors.textSecondary} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Tema Ayarları</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutSection}>
        <Pressable style={[styles.signOutButton, { backgroundColor: colors.error }]} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={colors.buttonText} />
          <Text style={[styles.signOutButtonText, { color: colors.buttonText }]}>Çıkış Yap</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>
          Chipmost v1.0.0 • Hesap ID: {state.user.id}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc3545',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0a58ca',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  welcomeSection: {
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
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
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
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  signOutSection: {
    marginBottom: 24,
  },
  signOutButton: {
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
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc3545',
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
});
