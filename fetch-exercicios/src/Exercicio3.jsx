import { useEffect, useState } from 'react';

function Exercicio3() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await fetch('https://reqres.in/api/users?page=2', {
          headers: { 'x-api-key': 'SUA_API_KEY_AQUI' },
        });
        const dados = await resposta.json();
        setUsuarios(dados.data);
      } catch (erro) {
        console.error('Erro ao buscar usuários:', erro);
      }
    }

    buscarUsuarios();
  }, []);

  return (
    <div>
      <h1>Exercício 3 — Usuários (página 2)</h1>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.first_name} {usuario.last_name} — {usuario.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Exercicio3;

