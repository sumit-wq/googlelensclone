import React from 'react';
import { Text, useColorScheme, StyleSheet } from 'react-native';

const ColorSwitchText = ({ text }) => {
  const colorScheme = useColorScheme();

  const letters = text.split('');
  
  const lightColors = [
    '#4285F4',
    '#EA4335', 
    '#FBBC05',
    '#4285F4',
    '#34A853', 
    '#EA4335', 
    '#FBBC05' 
  ];

  return (
    <Text style={styles.container}>
      {letters.map((letter, index) => (
        <Text
          key={index}
          style={[
            styles.letter,
            {
              color: colorScheme === 'dark' 
                ? '#FFFFFF' 
                : lightColors[index % lightColors.length]
            }
          ]}
        >
          {letter}
        </Text>
      ))}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default ColorSwitchText;