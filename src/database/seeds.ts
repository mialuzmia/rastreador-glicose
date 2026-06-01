import { SQLiteDatabase } from "expo-sqlite";

const REFEICOES = [
  { codigo: 1, nome: "Antes do café" },
  { codigo: 2, nome: "2h após café" },
  { codigo: 3, nome: "Antes do almoço" },
  { codigo: 4, nome: "2h após almoço" },
  { codigo: 5, nome: "Antes do jantar" },
  { codigo: 6, nome: "2h após jantar" },
];

export const seedRefeicoes = async (db: SQLiteDatabase): Promise<void> => {
  for (const r of REFEICOES) {
    await db.runAsync(
      "INSERT OR IGNORE INTO refeicoes (codigo, nome) VALUES (?, ?)",
      [r.codigo, r.nome],
    );
  }
};
