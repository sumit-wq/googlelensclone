import { StyleSheet } from 'react-native';
import { ThemeColors } from '../theme/types';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    marginBottom: 3,
    color: colors.textSecondary,
  },
  tabBarLabelActive: {
    color: colors.primary,
  },
});