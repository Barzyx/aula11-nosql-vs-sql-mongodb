import { useEffect, useState } from 'react';

function StatusAPI() {
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
        const dados = await resposta.json();
        setUsuarios(dados);
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

  let mensagem;
  if (carregando) {
    mensagem = 'Carregando...';
  } else if (erro) {
    mensagem = `Erro: ${erro}`;
  } else if (usuarios.length === 0) {
    mensagem = 'Nenhum item encontrado.';
  } else {
    mensagem = `Sucesso: ${usuarios.length} itens carregados.`;
  }

  return (
    <div>
      <h1>Exercício 5 — StatusAPI</h1>
      <p>{mensagem}</p>
    </div>
  );
}

export default StatusAPI;