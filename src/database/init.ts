import { SQLiteDatabase } from "expo-sqlite";
import { criarTabelas } from "./schema";
import { seedRefeicoes } from "./seeds";

export const onInitDatabase = async (db: SQLiteDatabase): Promise<void> => {
  await criarTabelas(db);
  await seedRefeicoes(db);
};
