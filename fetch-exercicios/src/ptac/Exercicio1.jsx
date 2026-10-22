// src/ptac/Exercicio1.jsx
import { useEffect, useState } from 'react';

function Exercicio1() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/users');
        const dados = await resposta.json();
        setUsuarios(dados);
      } finally {
        setCarregando(false);
      }
    }

    buscarUsuarios();
  }, []);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Exercício 1 — Lista de usuários</h1>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>{usuario.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Exercicio1;