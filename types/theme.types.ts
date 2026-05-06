export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: {
    // Background colors
    background: string;
    surface: string;
    card: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;
    
    // Primary colors
    primary: string;
    primaryLight: string;
    primaryDark: string;
    
    // Status colors
    success: string;
    error: string;
    warning: string;
    info: string;
    
    // Border colors
    border: string;
    borderLight: string;
    
    // Special colors
    shadow: string;
    overlay: string;
    disabled: string;
    
    // Tab bar
    tabBarBackground: string;
    tabBarActive: string;
    tabBarInactive: string;
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    primary: '#FF6B35',
    primaryLight: '#FF8C61',
    primaryDark: '#E55A2B',
    
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    disabled: '#CCCCCC',
    
    tabBarBackground: '#FFFFFF',
    tabBarActive: '#FF6B35',
    tabBarInactive: '#999999',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2C2C2C',
    
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textTertiary: '#808080',
    
    primary: '#FF6B35',
    primaryLight: '#FF8C61',
    primaryDark: '#E55A2B',
    
    success: '#66BB6A',
    error: '#EF5350',
    warning: '#FFA726',
    info: '#42A5F5',
    
    border: '#3A3A3A',
    borderLight: '#2C2C2C',
    
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    disabled: '#4A4A4A',
    
    tabBarBackground: '#1E1E1E',
    tabBarActive: '#FF6B35',
    tabBarInactive: '#808080',
  },
};
