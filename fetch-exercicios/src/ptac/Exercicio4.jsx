import { useEffect, useState } from 'react';

function Exercicio4() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function buscarUsuarios() {
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
        });
        if (!resposta.ok) {
          throw new Error(`HTTP ${resposta.status}`);
        }
        const data = []; // forçado de propósito para testar lista vazia
        setUsuarios(data);
      } catch (e) {
        if (e.name !== 'AbortError') {
          setErro(e.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    buscarUsuarios();

    return () => {
      controller.abort();
    };
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;
  if (usuarios.length === 0) return <p>Nenhum usuário encontrado.</p>;

  return (
    <div>
      <h1>Exercício 4 — Lista de usuários</h1>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>{usuario.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Exercicio4;