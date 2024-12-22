import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/themeContext';
import { createStyles } from './styles';
import { TAB_SCREENS } from './config';
import { normalize } from '../utils/normalizer';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
    id={undefined}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: normalize(60),
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: 0,
          elevation: 8,
          paddingVertical: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
         display: 'none'
        }
      }}
    >
      {TAB_SCREENS.map(({ name, component, iconName, focousedIcon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: ()=> <></>,
            tabBarIcon: ({ focused, color }) => (
              <View 
                style={[
                  {
                    paddingTop: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: normalize(44),
                    width: normalize(90),
                    marginTop: normalize(8)
                  },
                  focused && {
                    opacity: 1,
                    backgroundColor: '#E8F3FF', 
                    borderRadius: normalize(24),
                    marginTop: normalize(8)
                  }
                ]}
              >
                <Icon
                  name={focused ? focousedIcon : iconName}
                  size={26}
                  color={color}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};