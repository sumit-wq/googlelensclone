import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/themeContext';
import { normalize } from '../../utils/normalizer';

interface OptionCardProps {
  icon: string;
  title: string;
  iconColor?: string;
  onPress: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ icon, title, iconColor, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface }]} 
      onPress={onPress}
    >
      <Icon name={icon} size={24} color={iconColor || colors.primary} />
      <Text style={[styles.cardText, { color: colors.textPrimary }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const MoreScreen = () => {
  const { colors } = useTheme();

  const options = [
    {
      icon: 'star-four-points',
      title: 'Gemini',
      onPress: () => console.log('Gemini pressed')
    },
    {
      icon: 'flask',
      title: 'Search Labs',
      onPress: () => console.log('Search Labs pressed')
    },
    {
      icon: 'text-box-search',
      title: 'Search text in\nan image',
      onPress: () => console.log('Search text pressed')
    },
    {
      icon: 'music-note',
      title: 'Song Search',
      onPress: () => console.log('Song Search pressed')
    },
    {
      icon: 'application',
      title: 'Change app icon',
      onPress: () => console.log('Change icon pressed')
    },
    {
      icon: 'widgets',
      title: 'Add Search widget',
      onPress: () => console.log('Add widget pressed')
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>More</Text>
      
      <View style={styles.grid}>
        {options.map((option, index) => (
          <OptionCard
            key={index}
            icon={option.icon}
            title={option.title}
            onPress={option.onPress}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(16),
  },
  title: {
    fontSize: normalize(32),
    fontWeight: 'bold',
    marginBottom: normalize(24),
    marginTop: normalize(8),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: normalize(12),
  },
  card: {
    width: '48%',
    padding: normalize(16),
    borderRadius: normalize(16),
    minHeight: normalize(100),
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: normalize(16),
    fontWeight: '500',
    marginTop: normalize(8),
  }
});

export default MoreScreen;