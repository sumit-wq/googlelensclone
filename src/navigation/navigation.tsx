import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './tabNavigation';
import LensScreen from '../screen/lens';
import type { RootStackParamList } from './types';
import SearchScreen from '../screen/search';
import AudioScreen from '../screen/audio';
import SearchLens from '../screen/lensSearch';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const  AppNavigator = () => {

  return (
      <Stack.Navigator
       id={undefined}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name='MainTabs' component={TabNavigator} />
        <Stack.Screen name='Lens' component={LensScreen} />
        <Stack.Screen name='Search' component={SearchScreen} />
        <Stack.Screen name='Audio' component={AudioScreen} />
        <Stack.Screen name='SearchLens' component={SearchLens} />
      </Stack.Navigator>
  );
};
