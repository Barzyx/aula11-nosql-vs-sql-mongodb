import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export default function Exercicio2ExcluirComLog() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  }, []);

  function excluirUsuario(id, nome) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(() => {
      console.log(`Usuário ${nome} excluído`);
      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.filter((usuario) => usuario.id !== id)
      );
    });
  }

  return (
    <div>
      <h2>Exercício 2 — Excluir usuário (com log)</h2>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.name} ({usuario.email})
            <button onClick={() => excluirUsuario(usuario.id, usuario.name)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
