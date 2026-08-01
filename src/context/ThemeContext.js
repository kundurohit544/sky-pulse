import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@app_theme_mode';

// Light and Dark Color Schemes for UI components
export const LIGHT_COLORS = {
  mode: 'light',
  background: '#F1F5F9',
  surface: '#FFFFFF',
  cardBg: 'rgba(255, 255, 255, 0.85)',
  cardBgSolid: '#FFFFFF',
  cardBorder: 'rgba(226, 232, 240, 0.8)',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  accent: '#0284C7',
  accentLight: '#E0F2FE',
  iconColor: '#334155',
  glassHeader: 'rgba(255, 255, 255, 0.9)',
  inputBg: '#F8FAFC',
  inputBorder: '#E2E8F0',
  chipBg: '#E2E8F0',
  chipText: '#334155',
  shadowColor: '#64748B',
  statusBarStyle: 'dark',
  gradientHero: ['#38BDF8', '#0284C7', '#0369A1'],
  gradientBackground: ['#F8FAFC', '#E2E8F0', '#CBD5E1'],
  badgeBg: 'rgba(239, 68, 68, 0.15)',
  badgeText: '#DC2626',
};

export const DARK_COLORS = {
  mode: 'dark',
  background: '#0B0F19',
  surface: '#1E293B',
  cardBg: 'rgba(15, 23, 42, 0.75)',
  cardBgSolid: '#0F172A',
  cardBorder: 'rgba(255, 255, 255, 0.12)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accent: '#38BDF8',
  accentLight: 'rgba(56, 189, 248, 0.15)',
  iconColor: '#E2E8F0',
  glassHeader: 'rgba(11, 15, 25, 0.85)',
  inputBg: 'rgba(30, 41, 59, 0.8)',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  chipBg: 'rgba(30, 41, 59, 0.9)',
  chipText: '#CBD5E1',
  shadowColor: '#000000',
  statusBarStyle: 'light',
  gradientHero: ['#0F172A', '#1E293B', '#334155'],
  gradientBackground: ['#0B0F19', '#0F172A', '#1E293B'],
  badgeBg: 'rgba(239, 68, 68, 0.25)',
  badgeText: '#FCA5A5',
};

const ThemeContext = createContext({
  themeMode: 'system', // 'system' | 'light' | 'dark'
  isDark: true,
  colors: DARK_COLORS,
  setThemeMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme(); // 'light' or 'dark'
  const [themeMode, setThemeModeState] = useState('system');

  // Load saved theme preference on launch
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && ['system', 'light', 'dark'].includes(savedMode)) {
          setThemeModeState(savedMode);
        }
      } catch (err) {
        console.log('Failed to load theme preference:', err);
      }
    };
    loadThemePreference();
  }, []);

  // Setter that updates state & persists to AsyncStorage
  const setThemeMode = async (mode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (err) {
      console.log('Failed to save theme preference:', err);
    }
  };

  // Calculate actual active mode: if system, use device preference (defaulting to dark if null)
  const activeMode =
    themeMode === 'system'
      ? deviceColorScheme === 'light'
        ? 'light'
        : 'dark'
      : themeMode;

  const isDark = activeMode === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ themeMode, activeMode, isDark, colors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
