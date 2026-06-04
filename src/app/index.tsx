import { ThemedView } from '@/components/themed-view';
import ListaRegistros from '@/views/lista-registros';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ListaRegistros />
      </SafeAreaView>
    </ThemedView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    paddingTop: 16,
  },
});
