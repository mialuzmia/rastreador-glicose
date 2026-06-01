import { SQLiteDatabase } from "expo-sqlite";

export const criarTabelas = async (db: SQLiteDatabase): Promise<void> => {
  await db.execAsync(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS refeicoes (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo  INTEGER NOT NULL UNIQUE,
    nome    TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS registros_glicose (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    glicose        INTEGER NOT NULL,
    data_registro  TEXT    NOT NULL,
    id_refeicao    INTEGER NOT NULL,
    data_inclusao  TEXT DEFAULT (datetime('now')),
    data_alteracao TEXT DEFAULT NULL,

    FOREIGN KEY (id_refeicao) REFERENCES refeicoes(id)
  );

  CREATE INDEX IF NOT EXISTS idx_data_registro ON registros_glicose(data_registro);
  CREATE INDEX IF NOT EXISTS idx_id_refeicao   ON registros_glicose(id_refeicao);
`);
};
