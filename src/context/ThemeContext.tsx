import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tema türleri
export type ThemeType = 'light' | 'dark' | 'system';

// Renk paletleri
export interface ColorPalette {
  // Ana renkler
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Arka plan renkleri
  background: string;
  surface: string;
  card: string;
  
  // Metin renkleri
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Kenarlık ve ayırıcı renkler
  border: string;
  divider: string;
  
  // Durum renkleri
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Buton renkleri
  buttonPrimary: string;
  buttonSecondary: string;
  buttonText: string;
  
  // Özel renkler
  shadow: string;
  overlay: string;
}

// Light tema
const lightColors: ColorPalette = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  
  background: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#F8FAFC',
  
  text: '#1A1A1A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  
  border: '#E2E8F0',
  divider: '#F1F5F9',
  
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#0891B2',
  
  buttonPrimary: '#2563EB',
  buttonSecondary: '#64748B',
  buttonText: '#FFFFFF',
  
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

// Dark tema
const darkColors: ColorPalette = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  
  background: '#0F172A',
  surface: '#1E293B',
  card: '#1E293B',
  
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  
  border: '#334155',
  divider: '#475569',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#06B6D4',
  
  buttonPrimary: '#3B82F6',
  buttonSecondary: '#94A3B8',
  buttonText: '#FFFFFF',
  
  shadow: 'rgba(0, 0, 0, 0.25)',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

// Tema context interface'i
interface ThemeContextType {
  theme: ThemeType;
  colors: ColorPalette;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

// Context oluştur
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Tema provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [colors, setColors] = useState<ColorPalette>(lightColors);

  // Tema değişikliğini uygula
  const applyTheme = (newTheme: ThemeType) => {
    let effectiveTheme: 'light' | 'dark';
    
    if (newTheme === 'system') {
      effectiveTheme = systemColorScheme || 'light';
    } else {
      effectiveTheme = newTheme;
    }
    
    setColors(effectiveTheme === 'dark' ? darkColors : lightColors);
  };

  // Tema değiştir
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('chipmost_theme', newTheme);
      setThemeState(newTheme);
      applyTheme(newTheme);
    } catch (error) {
      console.error('Tema kaydedilemedi:', error);
    }
  };

  // Tema toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Sistem teması değişikliğini dinle
  useEffect(() => {
    applyTheme(theme);
  }, [theme, systemColorScheme]);

  // Kaydedilen temayı yükle
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('chipmost_theme');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Kaydedilen tema yüklenemedi:', error);
      }
    };

    loadSavedTheme();
  }, []);

  const value: ThemeContextType = {
    theme,
    colors,
    isDark: colors === darkColors,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Tema hook'u
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
