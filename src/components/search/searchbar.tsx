import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { normalize } from '../../utils/normalizer';

const SearchHeader = ({ 
  searchQuery, 
  onSearchChange, 
  onCameraPress, 
  onVoicePress, 
  onSearch,
  onBackPress 
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Icon name='arrow-back' size={24} color='#666' />
        </TouchableOpacity>
        
        <TextInput
          style={styles.searchInput}
          placeholder='Search or type URL'
          value={searchQuery}
          onChangeText={onSearchChange}
          onSubmitEditing={onSearch}
          returnKeyType='search'
          placeholderTextColor='#666'
          autoFocus
        />
        
        <TouchableOpacity style={styles.iconButton} onPress={onVoicePress}>
          <Image 
            source={require('../../../assets/mic.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton} onPress={onCameraPress}>
          <Image 
            source={require('../../../assets/lens.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: normalize(16),
    paddingHorizontal: normalize(8),
    backgroundColor: '#f1f3f4',
    borderRadius: normalize(40),
  },
  backButton: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: normalize(16),
    marginLeft: normalize(8),
    color: '#000',
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    width: normalize(32),
    height: normalize(32),
  }
});

export default SearchHeader;