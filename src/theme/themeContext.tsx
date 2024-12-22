import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from './themeConfig';
import { ThemeContextType, ThemeMode } from './types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_PREFERENCE_KEY = '@theme_preference';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>('system');
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async (): Promise<void> => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const getCurrentTheme = (): 'light' | 'dark' => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  };

  const isDarkMode = getCurrentTheme() === 'dark';
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const setTheme = async (newMode: ThemeMode): Promise<void> => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newMode);
      setThemeMode(newMode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      colors, 
      setTheme,
      themeMode
    }}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};