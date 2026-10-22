import { apiGet, apiPost } from '../api';

// Ex. 1 e 5 — confira o resultado no Console e em DevTools > Network > Request Headers
export async function testarApi() {
  const usuarios = await apiGet('/users');
  console.log('GET /users ->', usuarios);

  const criado = await apiPost(
    '/users',
    { name: 'Teste', email: 'teste@exemplo.com' },
    { headers: { 'X-Custom': 'aula07' } }
  );
  console.log('POST /users (com X-Custom) ->', criado);
}
