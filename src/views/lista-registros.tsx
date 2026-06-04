import ItemRegistro from '@/components/item-registro';
import { Refeicao, RegistroGlicose } from '@/database/types';
import { useRefeicao } from '@/hooks/use-refeicao';
import { useRegistroGlicose } from '@/hooks/use-registro-glicose';
import { useTheme } from '@/hooks/use-theme';
import { exportarCSV, exportarPDF } from '@/utils/exportar';
import { formatarStringDataParaExibicao } from '@/utils/formatadores';
import { agruparPorData } from '@/utils/registros';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, List, Menu } from 'react-native-paper';

const ListaRegistros = () => {
  const { buscarTodos } = useRegistroGlicose();
  const { buscarTodas } = useRefeicao();
  const [registros, setRegistros] = useState<RegistroGlicose[]>([]);
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([]);
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const [exportando, setExportando] = useState(false);
  const [menuExportarVisivel, setMenuExportarVisivel] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    buscarTodas().then((refeicoes) => {
      setRefeicoes(refeicoes);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      buscarTodos().then((registros) => {
        setRegistros(registros);
        const primeiraData = registros[0]?.data;
        setExpandidos(primeiraData ? new Set([primeiraData]) : new Set());
      });
    }, []),
  );

  const exportar = async (tipo: 'pdf' | 'csv') => {
    setMenuExportarVisivel(false);
    setExportando(true);
    try {
      if (tipo === 'pdf') await exportarPDF(registros, refeicoes);
      if (tipo === 'csv') await exportarCSV(registros, refeicoes);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar os registros.');
    } finally {
      setExportando(false);
    }
  };

  const toggleData = (data: string) => {
    setExpandidos((prev) => {
      const novo = new Set(prev);
      novo.has(data) ? novo.delete(data) : novo.add(data);
      return novo;
    });
  };

  const agrupados = agruparPorData(registros);
  const datas = Object.keys(agrupados);

  return (
    <>
      <View style={{ alignSelf: 'flex-end' }}>
        <Menu
          visible={menuExportarVisivel}
          onDismiss={() => setMenuExportarVisivel(false)}
          anchorPosition="bottom"
          anchor={
            <Button
              style={{ marginTop: 8, alignSelf: 'flex-end' }}
              icon={exportando ? undefined : 'download'}
              mode="contained"
              onPress={() => setMenuExportarVisivel(true)}
              disabled={exportando || registros.length === 0}>
              {exportando ? (
                <ActivityIndicator
                  size={16}
                  color="white"
                />
              ) : (
                'Exportar'
              )}
            </Button>
          }>
          <Menu.Item
            leadingIcon="file-pdf-box"
            title="Exportar PDF"
            onPress={() => exportar('pdf')}
          />
          <Menu.Item
            leadingIcon="file-delimited"
            title="Exportar CSV"
            onPress={() => exportar('csv')}
          />
        </Menu>
      </View>

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
