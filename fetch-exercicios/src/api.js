export const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Ex. 3 — erro HTTP que carrega o status junto
export class ApiError extends Error {
  constructor(status, statusText) {
    super(statusText || `Erro HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Ex. 4 e 5 — "signal" segue dentro de "resto"; headers extras são mesclados ao padrão
export async function requisicao(caminho, opcoes = {}) {
  const { headers: headersDaChamada, ...resto } = opcoes;
  const url = caminho.startsWith('http') ? caminho : `${BASE_URL}${caminho}`;

  const resp = await fetch(url, {
    ...resto,
    headers: { 'Content-Type': 'application/json', ...headersDaChamada },
  });

  if (!resp.ok) {
    throw new ApiError(resp.status, resp.statusText);
  }

  return resp.status === 204 ? null : resp.json();
}

export const apiGet = (caminho, opcoes = {}) =>
  requisicao(caminho, { ...opcoes, method: 'GET' });

export const apiPost = (caminho, dados, opcoes = {}) =>
  requisicao(caminho, { ...opcoes, method: 'POST', body: JSON.stringify(dados) });

export const apiPut = (caminho, dados, opcoes = {}) =>
  requisicao(caminho, { ...opcoes, method: 'PUT', body: JSON.stringify(dados) });

export const apiDelete = (caminho, opcoes = {}) =>
  requisicao(caminho, { ...opcoes, method: 'DELETE' });
