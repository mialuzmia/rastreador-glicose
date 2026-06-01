import { RefeicaoRepository } from "@/database/repositories/RefeicaoRepository";
import { Refeicao } from "@/database/types";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export const useRefeicao = () => {
  const db = useSQLiteContext();
  const repository = useMemo(() => new RefeicaoRepository(db), [db]);

  return {
    buscarTodas: (): Promise<Refeicao[]> => repository.buscarTodas(),

    buscarPorId: (id: number): Promise<Refeicao | null> =>
      repository.buscarPorId(id),
  };
};
