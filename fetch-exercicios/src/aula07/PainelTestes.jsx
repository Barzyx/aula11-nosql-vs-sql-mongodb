import { useState } from 'react';
import { apiGet, apiPut } from '../api';
import { testarApi } from './testeApi';
import { traduzirErro } from './mensagensDeErro';

export default function PainelTestes() {
  const [resultado, setResultado] = useState('');

  async function rodar(rotulo, tarefa) {
    setResultado('');
    try {
      await tarefa();
      setResultado(`${rotulo}: ok (veja o Console)`);
    } catch (erro) {
      setResultado(`${rotulo}: ${traduzirErro(erro)}`);
    }
  }

  return (
    <section>
      <h2>Painel de testes (Aula 07)</h2>
      <button onClick={() => rodar('Ex. 1 e 5', testarApi)}>GET + POST com X-Custom</button>{' '}
      <button onClick={() => rodar('404', () => apiGet('/users/9999'))}>Forçar 404</button>{' '}
      <button onClick={() => rodar('500', () => apiPut('/users/9999', { name: 'x' }))}>Forçar 500</button>{' '}
      <button onClick={() => rodar('Rede', () => apiGet('http://localhost:1/inexistente'))}>Forçar falha de rede</button>
      {resultado && <p>{resultado}</p>}
    </section>
  );
}
