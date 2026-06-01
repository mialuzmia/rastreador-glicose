// Entidades
export interface Refeicao {
  id: number;
  codigo: number;
  nome: string;
}

export interface RegistroGlicose {
  id: number;
  glicose: number;
  data: string;
  horario: string;
  refeicao: Refeicao;
}
// Requests

export interface InserirRegistroRequest {
  glicose: number;
  data: string; // "YYYY-MM-DD"
  horario: string; // "HH:MM"
  idRefeicao: number;
}

export interface AtualizarRegistroRequest {
  id: number;
  glicose: number;
  data: string;
  horario: string;
  idRefeicao: number;
}
