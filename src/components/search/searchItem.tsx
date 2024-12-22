import React from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {normalize} from '../../utils/normalizer';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ICON_NAME = {
  trending: 'trending-up',
  recent: 'schedule',
  suggestion: 'search',
};

const SearchItem = ({item, onDelete, onInfo, onPress}) => {
  const renderRightActions = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            backgroundColor: '#f2f3f5',
            justifyContent: 'center',
            alignItems: 'center',
            width: 70,
            height: '100%',
          }}
          onPress={() => onInfo?.(item)}>
          <Icon name='info-outline' size={24} color='#606268' />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#d83025',
            justifyContent: 'center',
            alignItems: 'center',
            width: 70,
            height: '100%',
          }}
          onPress={() => onDelete(item.id)}>
          <Icon name='delete' size={24} color='#fff' />
        </TouchableOpacity>
      </View>
    );
  };

  if (item.isTrending) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
        rightThreshold={40}
        friction={2}
        overshootRight={false}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: normalize(16),
            backgroundColor: '#fff',

            width: SCREEN_WIDTH,
          }}>
          <View
            style={{
              width: normalize(28),
              height: normalize(28),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f2f3f5',
              borderRadius: normalize(28),
            }}>
            <Icon name={ICON_NAME[item.type]} size={18} color='#606268' />
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#202124',
                lineHeight: 20,
              }}>
              {item.text}
            </Text>
            {item.subtitle && (
              <Text
                style={{
                  fontSize: 14,
                  color: '#5f6368',
                  marginTop: 2,
                }}>
                {item.subtitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default SearchItem;
