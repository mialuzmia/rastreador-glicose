import { SQLiteDatabase } from "expo-sqlite";
import {
  AtualizarRegistroRequest,
  InserirRegistroRequest,
  RegistroGlicose,
} from "../types";

export interface RegistroGlicoseRow {
  id: number;
  glicose: number;
  data: string;
  horario: string;
  id_refeicao: number;
  codigo_refeicao: number;
  nome_refeicao: string;
}

export class RegistroGlicoseRepository {
  constructor(private db: SQLiteDatabase) {}

  private mapToRegistro(raw: RegistroGlicoseRow): RegistroGlicose {
    return {
      id: raw.id,
      glicose: raw.glicose,
      data: raw.data,
      horario: raw.horario,
      refeicao: {
        id: raw.id_refeicao,
        codigo: raw.codigo_refeicao,
        nome: raw.nome_refeicao,
      },
    };
  }

  async inserir(request: InserirRegistroRequest): Promise<number> {
    const { glicose, data, horario, idRefeicao } = request;

    const data_registro = `${data} ${horario}`;

    const resultado = await this.db.runAsync(
      `
        INSERT INTO registros_glicose 
          (glicose, data_registro, id_refeicao) 
        VALUES 
          (?, ?, ?)
        `,
      [glicose, data_registro, idRefeicao],
    );

    return resultado.lastInsertRowId;
  }

  async buscarTodos(): Promise<RegistroGlicose[]> {
    const linhas = await this.db.getAllAsync<RegistroGlicoseRow>(`
      SELECT
        rg.id,
        rg.glicose,
        DATE(rg.data_registro) AS data,
        TIME(rg.data_registro) AS horario,
        ref.id                 AS id_refeicao,
        ref.codigo             AS codigo_refeicao,
        ref.nome               AS nome_refeicao
      FROM registros_glicose rg
      JOIN refeicoes ref ON ref.id = rg.id_refeicao
      ORDER BY rg.data_registro DESC
  `);

    return linhas.map(this.mapToRegistro);
  }

  async buscarPorId(id: number): Promise<RegistroGlicose | null> {
    const linha = await this.db.getFirstAsync<RegistroGlicoseRow>(
      `
      SELECT
        rg.id,
        rg.glicose,
        DATE(rg.data_registro) AS data,
        TIME(rg.data_registro) AS horario,
        ref.id                 AS id_refeicao,
        ref.codigo             AS codigo_refeicao,
        ref.nome               AS nome_refeicao
      FROM registros_glicose rg
      JOIN refeicoes ref ON ref.id = rg.id_refeicao
      WHERE rg.id = ?
    `,
      [id],
    );

    return linha ? this.mapToRegistro(linha) : null;
  }

  async buscarPorPeriodo(
    dataInicio: string,
    dataFim: string,
  ): Promise<RegistroGlicose[]> {
    const linhas = await this.db.getAllAsync<RegistroGlicoseRow>(
      `
      SELECT
        rg.id,
        rg.glicose,
        DATE(rg.data_registro) AS data,
        TIME(rg.data_registro) AS horario,
        ref.id                 AS id_refeicao,
        ref.codigo             AS codigo_refeicao,
        ref.nome               AS nome_refeicao
      FROM registros_glicose rg
      JOIN refeicoes ref ON ref.id = rg.id_refeicao
      WHERE DATE(rg.data_registro) BETWEEN ? AND ?
      ORDER BY rg.data_registro DESC
    `,
      [dataInicio, dataFim],
    );

    return linhas.map(this.mapToRegistro);
  }

  async atualizar(request: AtualizarRegistroRequest): Promise<void> {
    const { id, glicose, data, horario, idRefeicao } = request;

    const data_registro = `${data} ${horario}`;

    await this.db.runAsync(
      `
        UPDATE registros_glicose
        SET glicose = ?, data_registro = ?, id_refeicao = ?
        WHERE id = ?
      `,
      [glicose, data_registro, idRefeicao, id],
    );
  }

  async deletar(id: number): Promise<void> {
    await this.db.runAsync("DELETE FROM registros_glicose WHERE id = ?", [id]);
  }
}
