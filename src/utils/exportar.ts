import { Refeicao, RegistroGlicose } from '@/database/types';
import { formatarStringDataParaExibicao } from '@/utils/formatadores';
import { gerarHtmlTabela } from '@/utils/tabela';
import * as FileSystem from 'expo-file-system';
import { EncodingType, readAsStringAsync, StorageAccessFramework } from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type FormatoEscrita = 'utf8' | 'base64';
export type AcaoExportar = 'download' | 'compartilhar';
export type TipoArquivoExportar = 'pdf' | 'csv';

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

const gerarNomeArquivo = (extensao: TipoArquivoExportar): string => {
  const agora = new Date();

  const dia = String(agora.getDate()).padStart(2, '0');
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const ano = agora.getFullYear();
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');

  return `relatorio-glicose-${dia}-${mes}-${ano}_${horas}h${minutos}.${extensao}`;
};

const gerarConteudoCSV = (registros: RegistroGlicose[], refeicoes: Refeicao[]): string => {
  const { porData, datas } = montarTabelaPorData(registros);

  const header = ['Data', ...refeicoes.map((r) => r.nome)].join(',') + '\n';
  const linhas = datas
    .map((data) => {
      const registrosDia = porData.get(data)!;
      const colunas = refeicoes.map((r) => registrosDia.get(r.codigo) ?? '-').join(',');
      return `${formatarStringDataParaExibicao(data)},${colunas}`;
    })
    .join('\n');

  return header + linhas;
};

const gerarUriPDF = async (
  registros: RegistroGlicose[],
  refeicoes: Refeicao[],
  nome: string,
): Promise<string> => {
  const { porData, datas } = montarTabelaPorData(registros);
  const html = gerarHtmlTabela({ refeicoes, porData, datas, registros });

  const { uri } = await Print.printToFileAsync({ html });

  const destino = new FileSystem.File(FileSystem.Paths.cache, nome);

  new FileSystem.File(uri).move(destino);

  return destino.uri;
};

const salvarArquivo = async (
  nome: string,
  mimeType: string,
  conteudo: string,
  encoding: FormatoEscrita = 'utf8',
): Promise<void> => {
  const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) return;

  const uri = await StorageAccessFramework.createFileAsync(
    permissions.directoryUri,
    nome,
    mimeType,
  );

  await StorageAccessFramework.writeAsStringAsync(uri, conteudo, {
    encoding,
  });
};

const compartilharArquivo = async (uri: string, mimeType: string): Promise<void> => {
  await Sharing.shareAsync(uri, {
    mimeType,
    dialogTitle: 'Exportar registros de glicose',
  });
};

export const exportarPDF = async (
  registros: RegistroGlicose[],
  refeicoes: Refeicao[],
  acao: AcaoExportar,
): Promise<void> => {
  const nome = gerarNomeArquivo('pdf');
  const uri = await gerarUriPDF(registros, refeicoes, nome);

  if (acao === 'download') {
    const conteudo = await readAsStringAsync(uri, {
      encoding: EncodingType.Base64,
    });

    await salvarArquivo(nome, 'application/pdf', conteudo, 'base64'); // 👈
  } else {
    await compartilharArquivo(uri, 'application/pdf');
  }
};

export const exportarCSV = async (
  registros: RegistroGlicose[],
  refeicoes: Refeicao[],
  acao: AcaoExportar,
): Promise<void> => {
  const conteudo = gerarConteudoCSV(registros, refeicoes);
  const nome = gerarNomeArquivo('csv');

  if (acao === 'download') {
    await salvarArquivo(nome, 'text/csv', conteudo);
  } else {
    const arquivo = new FileSystem.File(FileSystem.Paths.cache, nome);
    arquivo.write(conteudo);
    await compartilharArquivo(arquivo.uri, 'text/csv');
  }
};
