export const formatarDataParaBanco = (date: Date): string => {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`; // "YYYY-MM-DD"
};

export const formatarDataParaExibicao = (date: Date): string => {
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();

  return `${dia}/${mes}/${ano}`; // "DD/MM/YYYY"
};

export const formatarHorario = (date: Date): string => {
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');

  return `${horas}:${minutos}`; // "HH:MM"
};
