# Exercícios — NoSQL vs SQL e consumo de API Express

## 1. Identificar o banco

Abra `http://localhost:3000/produtos` no DevTools (aba Network → Response) e veja o identificador:

- Se for **`"id": 1`** (número inteiro incremental) → indica **SQL** (Postgres/MySQL).
- Se for **`"_id": "65f1a2b3c4d5e6f7a8b9c0d1"`** (string de 24 caracteres hexadecimais) → indica **MongoDB** (ObjectId).

**Resposta da minha API:** o identificador é `id`, um número inteiro (1, 2, 3, 4), sem `_id`. Todos os objetos têm os mesmos campos (`id`, `nome`, `categoria`), sem subdocumentos e sem campos variáveis. Isso indica **SQL**.

**Justificativa:** o `_id` em formato ObjectId (24 hex, gerado automaticamente com timestamp) é a marca registrada do MongoDB. Bancos SQL costumam usar `id` inteiro incremental.

## 2. Documento café

```json
{ "_id": "abc123", "produto": "Café", "preco": 12.5, "tags": ["quente", "manhã"], "fornecedor": { "nome": "CoopeCafé", "cidade": "Dourados" } }
```

- (a) **`_id`:** `"abc123"` (no MongoDB real seria um ObjectId de 24 hex; aqui está simplificado).
- (b) **Subdocumento:** `fornecedor: { nome: "CoopeCafé", cidade: "Dourados" }` (objeto dentro do objeto).
- (c) **Array:** `tags: ["quente", "manhã"]`.

## 3. Definições

- **Coleção:** conjunto de documentos do MongoDB, equivalente a uma tabela no SQL (ou a uma "pasta de fichas"). Ex.: coleção `produtos`.
- **Schemaless:** não existe schema obrigatório; cada documento da mesma coleção pode ter campos diferentes (um com `tags`, outro com `ativo`, outro sem nenhum dos dois).

## 4. Vantagens

**SQL**

1. Schema rígido garante consistência: toda linha tem as mesmas colunas e tipos.
2. `JOIN` permite relacionar tabelas sem duplicar dados.
3. Transações e integridade referencial (chaves estrangeiras) muito maduras.

**MongoDB**

1. Schema flexível: dá para adicionar campos novos sem alterar os documentos antigos.
2. Subdocumentos e arrays guardam dados relacionados no mesmo documento, sem precisar de `JOIN`.
3. O formato é JSON/BSON, muito natural para JavaScript/Node e fácil de escalar horizontalmente.

## 5. URL de acesso

```
http://localhost:3000/produtos
```

(Ajuste porta e caminho se a API da turma for diferente.)

## 6. Componente consumidor

Ver `src/components/ListaProdutos.jsx` e `src/App.jsx`. O componente:

- faz `fetch` na URL da API com `AbortController`;
- trata **carregando**, **erro** (inclui `resp.ok`) e **vazio**;
- renderiza uma lista com `key={item._id ?? item.id}`.

## 7. Detetive de API

Se o JSON tem `_id` com 24 caracteres hexadecimais e alguns objetos têm campos que outros não têm, o backend provavelmente usa MongoDB, porque:

1. `_id` ObjectId (24 hex) é o identificador padrão do MongoDB, diferente do `id` inteiro incremental do SQL.
2. Campos variáveis entre objetos da mesma lista só acontecem com schema flexível; em SQL toda linha tem as mesmas colunas (o que faltaria viria como `NULL`).
3. Subdocumentos e arrays aninhados indicam o modelo de documentos (no SQL seriam tabelas separadas + `JOIN`).
