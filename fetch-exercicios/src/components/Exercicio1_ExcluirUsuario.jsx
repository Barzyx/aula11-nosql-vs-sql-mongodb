import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export default function Exercicio1ExcluirUsuario() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  }, []);

  function excluirUsuario(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(() => {
      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.filter((usuario) => usuario.id !== id)
      );
    });
  }

  return (
    <div>
      <h2>Exercício 1 — Excluir usuário</h2>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.name} ({usuario.email})
            <button onClick={() => excluirUsuario(usuario.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
