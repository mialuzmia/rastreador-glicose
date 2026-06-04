import { RegistroGlicose } from '@/database/types';
import { formatarStringDataParaExibicao } from './formatadores';

type TabelaData = {
  refeicoes: { codigo: number; nome: string }[];
  porData: Map<string, Map<number, number>>;
  datas: string[];
  registros: RegistroGlicose[];
};

export const gerarHtmlTabela = ({ refeicoes, porData, datas, registros }: TabelaData): string => {
  const headerColunas = ['<th>Data</th>', ...refeicoes.map((r) => `<th>${r.nome}</th>`)].join('');

  const linhas = datas
    .map((data) => {
      const registrosDia = porData.get(data)!;

      const colunas = refeicoes
        .map((r) => {
          const glicose = registrosDia.get(r.codigo);
          const vazio = glicose === undefined;
          return `<td class="${vazio ? 'vazio' : ''}">${glicose ?? '–'}</td>`;
        })
        .join('');

      return `<tr><td class="data">${formatarStringDataParaExibicao(data)}</td>${colunas}</tr>`;
    })
    .join('');

  return `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 11px;
              padding: 24px;
              color: #1a1a2e;
            }
            h1 {
              color: #6b4eff;
              font-size: 16px;
              margin-bottom: 4px;
            }
            p {
              color: #666;
              font-size: 11px;
              margin-bottom: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }
            th {
              background: #6b4eff;
              color: #fff;
              padding: 8px 6px;
              text-align: center;
              font-size: 10px;
              border: 1px solid #5a3de8;
            }
            td {
              padding: 7px 6px;
              text-align: center;
              border: 1px solid #ddd;
              font-size: 11px;
            }
            td.data {
              font-weight: bold;
              text-align: center;
              white-space: nowrap;
              color: #333;
            }
            td.vazio {
              color: #bbb;
            }
            tr:nth-child(even) td {
              background: #f5f3ff;
            }
          </style>
        </head>
        <body>
          <h1>Controle de Glicemia Capilar</h1>
          <p>${datas.length} dias</p>
          <table>
            <thead>
              <tr>
                ${headerColunas}
              </tr>
            </thead>
            <tbody>
              ${linhas}
            </tbody>
          </table>
        </body>
      </html>
    `;
};
