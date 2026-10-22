import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export default function Exercicio3EditarUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  }, []);

  function excluirUsuario(id, nome) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(() => {
      console.log(`Usuário ${nome} excluído`);
      setUsuarios((atuais) => atuais.filter((u) => u.id !== id));
    });
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

  function salvarEdicao(evento) {
    evento.preventDefault();
    const { id } = usuarioEmEdicao;

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioEmEdicao),
    })
      .then((res) => res.json())
      .then((usuarioAtualizado) => {
        setUsuarios((atuais) =>
          atuais.map((u) => (u.id === id ? { ...u, ...usuarioAtualizado } : u))
        );
        setUsuarioEmEdicao(null);
      });
  }

  return (
    <div>
      <h2>Exercício 3 — Editar usuário</h2>
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
