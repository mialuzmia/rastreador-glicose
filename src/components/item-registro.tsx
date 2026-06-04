import { RegistroGlicose } from '@/database/types';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Chip } from 'react-native-paper';

export type ItemRegistroProps = {
  registro: RegistroGlicose;
};

const ItemRegistro = ({ registro }: ItemRegistroProps) => {
  const theme = useTheme();
  return (
    <View style={[styles.registroCard, { backgroundColor: theme.backgroundCardSecondary }]}>
      <Text style={styles.glicoseText}>Glicose: {registro.glicose}</Text>
      <View style={styles.chips}>
        <Chip
          icon="clock-outline"
          compact
          mode="outlined">
          {registro.horario}
        </Chip>
        <Chip
          icon="silverware-fork-knife"
          compact
          mode="outlined">
          {registro.refeicao.nome}
        </Chip>
      </View>
    </View>
  );
};

export default ItemRegistro;

const styles = StyleSheet.create({
  registroCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    flex: 1,
    gap: 8,
    borderRadius: 4,
  },
  glicoseText: {
    fontWeight: 'bold',
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
});
