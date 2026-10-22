import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export default function Exercicio4TratamentoErro() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Falha ao carregar usuários (status ${res.status})`);
      const data = await res.json();
      setUsuarios(data);
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message);
    }
  }

  async function excluirUsuario(id, nome) {
    const listaAnterior = usuarios;
    setUsuarios((atuais) => atuais.filter((u) => u.id !== id));
    setErro(null);

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Falha ao excluir usuário (status ${res.status})`);
      console.log(`Usuário ${nome} excluído`);
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message);
      setUsuarios(listaAnterior);
    }
  }

  function abrirEdicao(usuario) {
    setUsuarioEmEdicao({ ...usuario });
  }

  function cancelarEdicao() {
    setUsuarioEmEdicao(null);
  }

  function atualizarCampoEdicao(campo, valor) {
    setUsuarioEmEdicao((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvarEdicao(evento) {
    evento.preventDefault();
    const listaAnterior = usuarios;
    const { id } = usuarioEmEdicao;
    const dadosParaSalvar = { ...usuarioEmEdicao };

    setUsuarios((atuais) =>
      atuais.map((u) => (u.id === id ? { ...u, ...dadosParaSalvar } : u))
    );
    setErro(null);

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaSalvar),
      });
      if (!res.ok) throw new Error(`Falha ao atualizar usuário (status ${res.status})`);
      const usuarioAtualizado = await res.json();
      setUsuarios((atuais) =>
        atuais.map((u) => (u.id === id ? { ...u, ...usuarioAtualizado } : u))
      );
      setUsuarioEmEdicao(null);
    } catch (erroRequisicao) {
      setErro(erroRequisicao.message);
      setUsuarios(listaAnterior);
    }
  }

  return (
    <div>
      <h2>Exercício 4 — Tratamento de erro com rollback</h2>

      {erro && <p style={{ color: "red" }}>Erro: {erro}</p>}

      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.name} ({usuario.email})
            <button onClick={() => abrirEdicao(usuario)}>Editar</button>
            <button onClick={() => excluirUsuario(usuario.id, usuario.name)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>

      {usuarioEmEdicao && (
        <form onSubmit={salvarEdicao}>
          <h3>Editando usuário #{usuarioEmEdicao.id}</h3>
          <label>
            Nome:
            <input
              type="text"
              value={usuarioEmEdicao.name}
              onChange={(e) => atualizarCampoEdicao("name", e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={usuarioEmEdicao.email}
              onChange={(e) => atualizarCampoEdicao("email", e.target.value)}
            />
          </label>
          <button type="submit">Salvar</button>
          <button type="button" onClick={cancelarEdicao}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
