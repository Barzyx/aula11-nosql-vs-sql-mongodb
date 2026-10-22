import { useEffect, useState } from 'react';
import ListaUsuarios from './ListaUsuarios';

function App() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await fetch('https://reqres.in/api/users?per_page=10', {
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
      <h1>Exercício 5 — Lista de usuários</h1>
      <ListaUsuarios usuarios={usuarios} />
    </div>
  );
}

export default App;
