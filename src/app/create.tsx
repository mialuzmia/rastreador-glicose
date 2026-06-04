import { ThemedView } from '@/components/themed-view';
import { Refeicao } from '@/database/types';
import { useRefeicao } from '@/hooks/use-refeicao';
import { useRegistroGlicose } from '@/hooks/use-registro-glicose';
import { useTheme } from '@/hooks/use-theme';
import { globalStyles } from '@/styles/global';
import {
  formatarDataParaBanco,
  formatarDataParaExibicao,
  formatarHorario,
} from '@/utils/formatadores';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Menu, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const Create = () => {
  const { buscarTodas } = useRefeicao();
  const { inserir, buscarTodos: buscarRegistros } = useRegistroGlicose();
  const theme = useTheme();

  const [glicose, setGlicose] = useState<string>('');
  const [data, setData] = useState<string>(''); // "YYYY-MM-DD"
  const [dataExibicao, setDataExibicao] = useState<string>(''); // "DD/MM/YYYY"
  const [horario, setHorario] = useState<string>(''); // "HH:MM"
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([]);
  const [refeicaoSelecionada, setRefeicaoSelecionada] = useState<Refeicao | null>(null);
  const [menuVisivel, setMenuVisivel] = useState(false);

  const limparInputs = () => {
    setGlicose('');
    setData('');
    setDataExibicao('');
    setHorario('');
    setRefeicaoSelecionada(null);
    setMenuVisivel(false);
  };

  useEffect(() => {
    buscarTodas().then(setRefeicoes);
    buscarRegistros().then((response) => {
      console.log('registros: ', response);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        limparInputs();
      };
    }, []),
  );

  const salvar = async () => {
    try {
      const request = {
        glicose: Number(glicose),
        data,
        horario,
        idRefeicao: refeicaoSelecionada!.id,
      };
      console.log('request: ', request);
      await inserir(request);
      limparInputs();
    } catch (error) {}
  };

  const aoMudarGlicose = (value: string) => {
    const apenasNumeros = value.replace(/[^0-9]/g, '');
    setGlicose(apenasNumeros);
  };

  const aoSelecionarRefeicao = (refeicao: Refeicao) => {
    setRefeicaoSelecionada(refeicao);
    setMenuVisivel(false);
  };

  const abrirDatePicker = () => {
    DateTimePickerAndroid.open({
      value: data ? new Date(data) : new Date(),
      mode: 'date',
      onChange: (_, dataSelecionada) => {
        if (!dataSelecionada) return;

        setData(formatarDataParaBanco(dataSelecionada));
        setDataExibicao(formatarDataParaExibicao(dataSelecionada));
      },
    });
  };

  const abrirTimePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      mode: 'time',
      is24Hour: true,
      onChange: (_, dataSelecionada) => {
        if (!dataSelecionada) return;

        setHorario(formatarHorario(dataSelecionada));
      },
    });
  };

  const onPressSelectRefeicoes = () => {
    if (Keyboard.isVisible()) {
      const inscricao = Keyboard.addListener('keyboardDidHide', () => {
        setMenuVisivel(true);
        inscricao.remove();
      });
      Keyboard.dismiss();
    } else {
      setMenuVisivel(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={globalStyles.pageContainer}>
        <SafeAreaView style={globalStyles.safeArea}>
          <View style={[styles.formContainer, { backgroundColor: theme.surfaceBright }]}>
            <TextInput
              mode="outlined"
              label="Glicose"
              value={glicose}
              onChangeText={aoMudarGlicose}
              keyboardType="numeric"
            />

            <Pressable onPress={abrirDatePicker}>
              <TextInput
                mode="outlined"
                label="Data"
                value={dataExibicao}
                editable={false}
                pointerEvents="none"
                right={
                  <TextInput.Icon
                    icon="calendar-month"
                    onPress={abrirDatePicker}
                  />
                }
              />
            </Pressable>

            <Pressable onPress={abrirTimePicker}>
              <TextInput
                mode="outlined"
                label="Horário"
                value={horario}
                editable={false}
                pointerEvents="none"
                right={
                  <TextInput.Icon
                    icon="clock-outline"
                    onPress={abrirTimePicker}
                  />
                }
              />
            </Pressable>

            <Menu
              visible={menuVisivel}
              onDismiss={() => setMenuVisivel(false)}
              anchorPosition="bottom"
              anchor={
                <Pressable onPress={() => onPressSelectRefeicoes()}>
                  <TextInput
                    mode="outlined"
                    label="Refeição"
                    value={refeicaoSelecionada?.nome ?? ''}
                    editable={false}
                    pointerEvents="none"
                    right={<TextInput.Icon icon="silverware-fork-knife" />}
                  />
                </Pressable>
              }>
              {refeicoes.map((refeicao) => (
                <Menu.Item
                  key={refeicao.id}
                  title={refeicao.nome}
                  onPress={() => aoSelecionarRefeicao(refeicao)}
                />
              ))}
            </Menu>

            <Button
              style={{ marginTop: 'auto', alignSelf: 'flex-end', paddingHorizontal: 4 }}
              icon="content-save"
              mode="contained"
              onPress={salvar}>
              Salvar
            </Button>
          </View>
        </SafeAreaView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Create;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: '100%',
    gap: 8,
    borderRadius: 12,
    padding: 24,
    marginTop: 16,
  },
});
