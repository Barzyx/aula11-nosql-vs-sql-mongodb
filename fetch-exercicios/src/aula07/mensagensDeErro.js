import { ApiError } from '../api';

// Ex. 3 — transforma qualquer erro em texto para a tela
export function traduzirErro(erro) {
  if (erro instanceof ApiError) {
    if (erro.status === 404) return 'Recurso não encontrado';
    if (erro.status === 500) return 'Erro no servidor';
    return `Erro ${erro.status}: ${erro.message}`;
  }
  if (erro instanceof TypeError) return 'Falha de rede';
  return 'Erro inesperado';
}
