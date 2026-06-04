import { Refeicao, RegistroGlicose } from '@/database/types';
import { formatarStringDataParaExibicao } from '@/utils/formatadores';
import { gerarHtmlTabela } from '@/utils/tabela';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const montarTabelaPorData = (registros: RegistroGlicose[]) => {
  const porData = new Map<string, Map<number, number>>();

  registros.forEach((r) => {
    if (!porData.has(r.data)) {
      porData.set(r.data, new Map());
    }
    porData.get(r.data)!.set(r.refeicao.codigo, r.glicose);
  });

  const datas = Array.from(porData.keys()).sort();

  return { porData, datas };
};

export const exportarPDF = async (
  registros: RegistroGlicose[],
  refeicoes: Refeicao[],
): Promise<void> => {
  const { porData, datas } = montarTabelaPorData(registros);

  const html = gerarHtmlTabela({ refeicoes, porData, datas, registros });

  const { uri } = await Print.printToFileAsync({ html });

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Exportar registros de glicose',
  });
};

export const exportarCSV = async (
  registros: RegistroGlicose[],
  refeicoes: Refeicao[],
): Promise<void> => {
  const { porData, datas } = montarTabelaPorData(registros);

  const header = ['Data', ...refeicoes.map((r) => r.nome)].join(',') + '\n';

  const linhas = datas
    .map((data) => {
      const registrosDia = porData.get(data)!;
      const colunas = refeicoes.map((r) => registrosDia.get(r.codigo) ?? '-').join(',');
      return `${formatarStringDataParaExibicao(data)},${colunas}`;
    })
    .join('\n');

  const conteudo = header + linhas;

  const file = new FileSystem.File(FileSystem.Paths.cache, 'glicose.csv');

  file.write(conteudo);

  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv',
    dialogTitle: 'Exportar registros de glicose',
  });
};
