import { useEffect, useState } from 'react';

function Exercicio4() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function buscarUsuario() {
      try {
        const resposta = await fetch('https://reqres.in/api/users/5', {
          headers: { 'x-api-key': 'SUA_API_KEY_AQUI' },
        });
        const dados = await resposta.json();
        setUsuario(dados.data);
      } catch (erro) {
        console.error('Erro ao buscar usuário:', erro);
      }
    }

    buscarUsuario();
  }, []);

  if (!usuario) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>{usuario.first_name} {usuario.last_name}</h1>
      <p>{usuario.email}</p>
    </div>
  );
}
export default Exercicio4;
