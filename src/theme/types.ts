export interface ThemeColors {
    primary: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    tabBarActive: string;
    tabBarInactive: string;
    tabBarBackground: string;
    tabBarBorder: string;
    tabItemFocusedBackground: string;
    text: string
  }
  
  export type ThemeMode = 'light' | 'dark' | 'system';
  
  export interface ThemeContextType {
    isDarkMode: boolean;
    colors: ThemeColors;
    setTheme: (mode: ThemeMode) => Promise<void>;
    themeMode: ThemeMode;
  }