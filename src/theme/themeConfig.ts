import { ThemeColors as ThemeColorsType } from './types';

export const COLORS: Record<'light' | 'dark', ThemeColorsType> = {
  light: {
    primary: '#1a73e8',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#202124',
    textSecondary: '#5F6368',
    border: '#DADCE0',
    tabBarActive: '#007AFF',
    tabBarInactive: '#5F6368',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E5E5E5',
    tabItemFocusedBackground: '#E8F3FF',
    text: ''
  },
  dark: {
    primary: '#8AB4F8',
    background: '#202124',
    surface: '#303134',
    textPrimary: '#E8EAED',
    textSecondary: '#9AA0A6',
    border: '#3C4043',
    tabBarActive: '#0A84FF',
    tabBarInactive: '#9AA0A6',
    tabBarBackground: '#202124',
    tabBarBorder: '#3C4043',
    tabItemFocusedBackground: '#1C1C1E',
    text: '#000000'
  },
};

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
}