import ItemRegistro from '@/components/item-registro';
import { RegistroGlicose } from '@/database/types';
import { useRegistroGlicose } from '@/hooks/use-registro-glicose';
import { useTheme } from '@/hooks/use-theme';
import { formatarStringDataParaExibicao } from '@/utils/formatadores';
import { agruparPorData } from '@/utils/registros';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, List } from 'react-native-paper';

const ListaRegistros = () => {
  const { buscarTodos } = useRegistroGlicose();
  const [registros, setRegistros] = useState<RegistroGlicose[]>([]);
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      buscarTodos().then((dados) => {
        setRegistros(dados);
        const primeiraData = dados[0]?.data;
        setExpandidos(primeiraData ? new Set([primeiraData]) : new Set());
      });
    }, []),
  );

  const toggleData = (data: string) => {
    setExpandidos((prev) => {
      const novo = new Set(prev);
      novo.has(data) ? novo.delete(data) : novo.add(data);
      return novo;
    });
  };

  const agrupados = agruparPorData(registros);
  const datas = Object.keys(agrupados);

  const exportar = () => {
    console.log('exportar');
  };

  return (
    <>
      <Button
        style={{ marginTop: 8, alignSelf: 'flex-end' }}
        icon="download"
        mode="contained"
        onPress={exportar}>
        Salvar
      </Button>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        {datas.map((data) => (
          <View
            key={data}
            style={styles.accordionWrapper}>
            <List.Accordion
              key={data}
              id={data}
              expanded={expandidos.has(data)}
              onPress={() => toggleData(data)}
              title={`Data: ${formatarStringDataParaExibicao(data)}`}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="calendar-month"
                />
              )}
              containerStyle={styles.accordion}
              style={[styles.accordion, { backgroundColor: theme.surfaceBright }]}>
              <View style={styles.registrosContainer}>
                {agrupados[data].map((registro) => (
                  <ItemRegistro
                    key={registro.id}
                    registro={registro}
                  />
                ))}
              </View>
            </List.Accordion>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default ListaRegistros;

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    flex: 1,
    height: '100%',
    marginTop: 16,
  },
  scrollContent: {
    gap: 8,
    paddingBottom: 16,
  },
  accordion: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  registrosContainer: {
    marginTop: 8,
    paddingLeft: 0,
    gap: 8,
  },
  accordionWrapper: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  accordionContent: {
    // gap: 20,
  },
});
