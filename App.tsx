import React from 'react';
import { SafeAreaView, StatusBar, Text, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AppNavigator } from './src/navigation/navigation';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/themeContext';
import { NavigationContainer } from '@react-navigation/native';
import PermissionBoot from './src/managers/permissionManager';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

enableScreens();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{ ...backgroundStyle, flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
              />
              <AppNavigator />
              <PermissionBoot />
            </ThemeProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
      </Provider>
    </SafeAreaView>
  );
}

export default App;
