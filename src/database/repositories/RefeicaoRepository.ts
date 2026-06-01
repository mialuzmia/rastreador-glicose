import { SQLiteDatabase } from "expo-sqlite";
import { Refeicao } from "../types";

export class RefeicaoRepository {
  constructor(private db: SQLiteDatabase) {}

  async buscarTodas(): Promise<Refeicao[]> {
    return this.db.getAllAsync<Refeicao>(
      `SELECT * FROM refeicoes 
        ORDER BY codigo ASC `,
    );
  }

  async buscarPorId(id: number): Promise<Refeicao | null> {
    return (
      this.db.getFirstAsync<Refeicao>("SELECT * FROM refeicoes WHERE id = ?", [
        id,
      ]) ?? null
    );
  }
}
