import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { onInitDatabase } from '@/database/init';
import { PaperProvider } from 'react-native-paper';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <SQLiteProvider
      databaseName="rastreador-glicose.db"
      onInit={onInitDatabase}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PaperProvider>
          <AnimatedSplashOverlay />
          <AppTabs />
        </PaperProvider>
      </ThemeProvider>
    </SQLiteProvider>
  );
}
