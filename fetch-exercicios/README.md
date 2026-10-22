# Fetch e CRUD com React: Atividade em Dupla

**Autores:** João Gabriel Rodrigues Barz e Guilherme Henrique Marques Bastos
**Turma:** Informática 6B

Exercícios de consumo de API com `fetch` em React + Vite, usando a API de testes [JSONPlaceholder](https://jsonplaceholder.typicode.com).

## O que o projeto tem

- Exercícios das aulas anteriores (`fetch`, `useEffect`, DELETE, PUT, tratamento de erro e mini-CRUD) nas pastas `src/components`, `src/ptac` e `src/Exercicio5`.
- **Lista 07 (Aula 07):** um helper de requisições reutilizável e a CRUD de usuários refatorada para usá-lo.

## Lista 07: estrutura

| Arquivo | O que faz |
| --- | --- |
| `src/api.js` | `BASE_URL`, `ApiError`, `requisicao`, `apiGet`, `apiPost`, `apiPut` e `apiDelete`. Aceita `signal` (cancelamento) e mescla headers extras com o `Content-Type` padrão. |
| `src/aula07/CrudUsuarios.jsx` | CRUD de usuários (criar, listar, editar, excluir) sem nenhuma chamada direta a `fetch`. |
| `src/aula07/mensagensDeErro.js` | Converte erros em mensagens: 404, 500 e falha de rede. |
| `src/aula07/PainelTestes.jsx` | Botões para testar o helper, os erros e os headers. |

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Como conferir os critérios

- **Helper e headers:** clique em "GET + POST com X-Custom" e veja o Console e a aba Network (Request Headers).
- **Erros:** use "Forçar 404", "Forçar 500" e "Forçar falha de rede".
- **Cancelamento:** a carga inicial usa `AbortController`; o `AbortError` nunca aparece como erro na tela.

## Tecnologias

React 19, Vite e ESLint.