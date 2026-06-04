import { RegistroGlicose } from '@/database/types';
import { orderBy } from 'lodash-es';

const ordenarPorHorario = (registros: RegistroGlicose[]): RegistroGlicose[] => {
  return orderBy(registros, 'horario', 'desc');
};

export const agruparPorData = (registros: RegistroGlicose[]): Record<string, RegistroGlicose[]> => {
  const agrupados = registros.reduce(
    (acc, registro) => {
      if (!acc[registro.data]) {
        acc[registro.data] = [];
      }
      acc[registro.data].push(registro);
      return acc;
    },
    {} as Record<string, RegistroGlicose[]>,
  );
  return Object.fromEntries(
    Object.entries(agrupados).map(([data, itens]) => [data, ordenarPorHorario(itens)]),
  );
};
