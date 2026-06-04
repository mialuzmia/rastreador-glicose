import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useSQLiteContext } from 'expo-sqlite';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const db = useSQLiteContext();
  useDrizzleStudio(db);
  return (
    <NativeTabs
      backgroundColor={'#fff'}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Lista</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="list"
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="create">
        <NativeTabs.Trigger.Label>Criar</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="edit"
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
