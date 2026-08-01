import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { WeatherProvider } from './src/context/WeatherContext';
import AppNavigator from './src/navigation/AppNavigator';

function MainApp() {
  const { colors } = useTheme();
  return (
    <NavigationContainer>
      <StatusBar style={colors.statusBarStyle} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <WeatherProvider>
          <MainApp />
        </WeatherProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
