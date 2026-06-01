import { RegistroGlicoseRepository } from "@/database/repositories/RegistroGlicoseRepository";
import {
  AtualizarRegistroRequest,
  InserirRegistroRequest,
  RegistroGlicose,
} from "@/database/types";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export const useRegistroGlicose = () => {
  const db = useSQLiteContext();
  const repository = useMemo(() => new RegistroGlicoseRepository(db), [db]);

  return {
    inserir: (request: InserirRegistroRequest): Promise<number> =>
      repository.inserir(request),

    buscarTodos: (): Promise<RegistroGlicose[]> => repository.buscarTodos(),

    buscarPorId: (id: number): Promise<RegistroGlicose | null> =>
      repository.buscarPorId(id),

    buscarPorPeriodo: (
      dataInicio: string,
      dataFim: string,
    ): Promise<RegistroGlicose[]> =>
      repository.buscarPorPeriodo(dataInicio, dataFim),

    atualizar: (request: AtualizarRegistroRequest): Promise<void> =>
      repository.atualizar(request),

    deletar: (id: number): Promise<void> => repository.deletar(id),
  };
};
