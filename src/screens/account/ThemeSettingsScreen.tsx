import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { ThemeType } from '../../context/ThemeContext';

export default function ThemeSettingsScreen() {
  const navigation = useNavigation();
  const { theme, colors, setTheme, isDark } = useTheme();
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  const themeOptions: Array<{
    type: ThemeType;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  }> = [
    {
      type: 'light',
      title: 'Açık Tema',
      description: 'Beyaz arka plan, koyu metinler',
      icon: 'sunny',
    },
    {
      type: 'dark',
      title: 'Koyu Tema',
      description: 'Koyu arka plan, açık metinler',
      icon: 'moon',
    },
    {
      type: 'system',
      title: 'Sistem Teması',
      description: 'Cihaz ayarlarına göre otomatik',
      icon: 'settings',
    },
  ];

  const handleThemeSelect = async (selectedTheme: ThemeType) => {
    if (selectedTheme === theme || isChangingTheme) return;
    
    setIsChangingTheme(true);
    try {
      await setTheme(selectedTheme);
    } catch (error) {
      console.error('Tema değiştirilemedi:', error);
    } finally {
      // Kısa bir gecikme ile loading state'i kaldır
      setTimeout(() => setIsChangingTheme(false), 300);
    }
  };

  const renderThemeOption = (option: typeof themeOptions[0]) => {
    const isSelected = theme === option.type;
    const isDisabled = isChangingTheme;
    
    return (
      <Pressable
        key={option.type}
        style={[
          styles.themeOption,
          {
            backgroundColor: colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
            opacity: isDisabled ? 0.6 : 1,
          },
        ]}
        onPress={() => handleThemeSelect(option.type)}
        disabled={isDisabled}
      >
        <View style={styles.themeOptionHeader}>
          <View style={[
            styles.iconContainer,
            {
              backgroundColor: isSelected ? colors.primary : colors.surface,
            }
          ]}>
            {isChangingTheme && isSelected ? (
              <ActivityIndicator size="small" color={colors.buttonText} />
            ) : (
              <Ionicons
                name={option.icon}
                size={24}
                color={isSelected ? colors.buttonText : colors.textSecondary}
              />
            )}
          </View>
          
          <View style={styles.themeOptionContent}>
            <Text style={[styles.themeOptionTitle, { color: colors.text }]}>
              {option.title}
            </Text>
            <Text style={[styles.themeOptionDescription, { color: colors.textSecondary }]}>
              {option.description}
            </Text>
          </View>
        </View>

        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={16} color={colors.buttonText} />
          </View>
        )}
      </Pressable>
    );
  };

  const renderThemePreview = () => (
    <View style={[styles.previewContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.previewTitle, { color: colors.text }]}>
        Tema Önizlemesi
      </Text>
      
      <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.previewHeader}>
          <View style={[styles.previewAvatar, { backgroundColor: colors.primary }]} />
          <View style={styles.previewTextContainer}>
            <Text style={[styles.previewText, { color: colors.text }]}>
              Örnek Başlık
            </Text>
            <Text style={[styles.previewSubtext, { color: colors.textSecondary }]}>
              Örnek alt metin
            </Text>
          </View>
        </View>
        
        <View style={styles.previewActions}>
          <View style={[styles.previewButton, { backgroundColor: colors.buttonPrimary }]}>
            <Text style={[styles.previewButtonText, { color: colors.buttonText }]}>
              Birincil Buton
            </Text>
          </View>
          
          <View style={[styles.previewButton, { backgroundColor: colors.buttonSecondary }]}>
            <Text style={[styles.previewButtonText, { color: colors.buttonText }]}>
              İkincil Buton
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Tema Ayarları
        </Text>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tema Seçenekleri */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Tema Seçin
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Uygulamanın görünümünü kişiselleştirin
          </Text>
          
          <View style={styles.themeOptions}>
            {themeOptions.map(renderThemeOption)}
          </View>
        </View>

        {/* Tema Önizlemesi */}
        {renderThemePreview()}

        {/* Bilgi */}
        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Tema değişiklikleri anında uygulanır ve cihazınızda kaydedilir.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  
  headerSpacer: {
    width: 40,
  },
  
  content: {
    flex: 1,
    padding: 16,
  },
  
  section: {
    marginBottom: 24,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  
  themeOptions: {
    gap: 12,
  },
  
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  
  themeOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  themeOptionContent: {
    flex: 1,
  },
  
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  themeOptionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  previewContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  previewCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  
  previewTextContainer: {
    flex: 1,
  },
  
  previewText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  
  previewSubtext: {
    fontSize: 14,
  },
  
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  
  previewButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  
  previewButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  infoSection: {
    marginBottom: 24,
  },
  
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
