import type { ThemeDefinition } from 'vuetify'

export const MAIN_THEME = 'mainTheme'

export const mainTheme: ThemeDefinition = {
  colors: {
    background: '#F5F5F5',
    error: '#F44336',
    info: '#2196F3',
    'on-background': '#212121',
    'on-surface': '#212121',
    primary: '#50A6FF',
    secondary: '#E6E9FF',
    success: '#4CAF50',
    surface: '#FFFFFF',
    warning: '#FFC107',
  },
  dark: false,
}

export const MAIN_DARK_THEME = 'mainDarkTheme'

export const mainDarkTheme: ThemeDefinition = {
  colors: {
    background: '#0C111B',
    error: '#ef4444',
    info: '#3b82f6',
    primary: '#6366f1',
    secondary: '#9333ea',
    success: '#22c55e',
    surface: '#1f2937',
    warning: '#f59e0b',
  },
  dark: true,
}
