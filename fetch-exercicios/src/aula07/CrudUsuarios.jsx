import { useEffect, useRef, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';
import { traduzirErro } from './mensagensDeErro';

const FORM_VAZIO = { name: '', email: '' };

export default function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroLista, setErroLista] = useState(null);

  const [formVisivel, setFormVisivel] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);

  const [statusPorItem, setStatusPorItem] = useState({});

  // controllers das operações de escrita (POST/PUT/DELETE), cancelados ao desmontar
  const controllersAtivos = useRef(new Set());

  // Ex. 4 — carga inicial cancelável; AbortError nunca vira mensagem na tela
  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      try {
        const lista = await apiGet('/users', { signal: controller.signal });
        setUsuarios(lista);
      } catch (erro) {
        if (erro.name === 'AbortError') return;
        setErroLista(traduzirErro(erro));
      } finally {
        if (!controller.signal.aborted) setCarregandoLista(false);
      }
    }

    carregar();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const ativos = controllersAtivos.current;
    return () => {
      ativos.forEach((c) => c.abort());
      ativos.clear();
    };
  }, []);

  function criarControllerRastreado() {
    const controller = new AbortController();
    controllersAtivos.current.add(controller);
    return controller;
  }

  function liberarController(controller) {
    controllersAtivos.current.delete(controller);
  }

  function definirStatus(chave, status) {
    setStatusPorItem((atual) => ({ ...atual, [chave]: status }));
  }

  function abrirNovo() {
    setIdEmEdicao(null);
    setForm(FORM_VAZIO);
    setFormVisivel(true);
  }

  function abrirEdicao(usuario) {
    setIdEmEdicao(usuario.id);
    setForm({ name: usuario.name, email: usuario.email });
    setFormVisivel(true);
  }

  function fecharForm() {
    setFormVisivel(false);
    setIdEmEdicao(null);
    setForm(FORM_VAZIO);
  }

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvarForm(evento) {
    evento.preventDefault();
    const emEdicao = idEmEdicao !== null;
    const chave = emEdicao ? idEmEdicao : 'novo';
    const controller = criarControllerRastreado();
    const opcoes = { signal: controller.signal };

    definirStatus(chave, { carregando: true, erro: null });

    try {
      const usuarioSalvo = emEdicao
        ? await apiPut(`/users/${idEmEdicao}`, form, opcoes)
        : await apiPost('/users', form, opcoes);

      if (emEdicao) {
        setUsuarios((atuais) =>
          atuais.map((u) => (u.id === idEmEdicao ? { ...u, ...usuarioSalvo } : u))
        );
      } else {
        // a API de teste devolve sempre o mesmo id, então gero um local
        setUsuarios((atuais) => [...atuais, { ...usuarioSalvo, id: Date.now() }]);
      }

      definirStatus(chave, { carregando: false, erro: null });
      fecharForm();
    } catch (erro) {
      if (erro.name !== 'AbortError') {
        definirStatus(chave, { carregando: false, erro: traduzirErro(erro) });
      }
    } finally {
      liberarController(controller);
    }
  }

  async function excluirUsuario(id) {
    const listaAnterior = usuarios;
    const controller = criarControllerRastreado();

    setUsuarios((atuais) => atuais.filter((u) => u.id !== id));
    definirStatus(id, { carregando: true, erro: null });

    try {
      await apiDelete(`/users/${id}`, { signal: controller.signal });
      definirStatus(id, { carregando: false, erro: null });
    } catch (erro) {
      if (erro.name !== 'AbortError') {
        definirStatus(id, { carregando: false, erro: traduzirErro(erro) });
        setUsuarios(listaAnterior);
      }
    } finally {
      liberarController(controller);
    }
  }

  return (
    <div>
      <h2>CRUD de usuários (usando api.js)</h2>

      <button onClick={abrirNovo}>Novo</button>

      {carregandoLista && <p>Carregando usuários...</p>}
      {erroLista && <p style={{ color: 'red' }}>Erro: {erroLista}</p>}

      <ul>
        {usuarios.map((usuario) => {
          const status = statusPorItem[usuario.id];
          return (
            <li key={usuario.id}>
              {usuario.name} ({usuario.email}){' '}
              <button onClick={() => abrirEdicao(usuario)}>Editar</button>{' '}
              <button onClick={() => excluirUsuario(usuario.id)}>Excluir</button>
              {status?.carregando && <span> (processando...)</span>}
              {status?.erro && <p style={{ color: 'red' }}>Erro: {status.erro}</p>}
            </li>
          );
        })}
      </ul>

      {formVisivel && (
        <form onSubmit={salvarForm}>
          <h3>{idEmEdicao !== null ? `Editando usuário #${idEmEdicao}` : 'Novo usuário'}</h3>
          <label>
            Nome:
            <input
              type="text"
              value={form.name}
              onChange={(e) => atualizarCampo('name', e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={form.email}
              onChange={(e) => atualizarCampo('email', e.target.value)}
              required
            />
          </label>
          <button type="submit">Salvar</button>
          <button type="button" onClick={fecharForm}>Cancelar</button>

          {statusPorItem['novo']?.erro && (
            <p style={{ color: 'red' }}>Erro: {statusPorItem['novo'].erro}</p>
          )}
          {idEmEdicao !== null && statusPorItem[idEmEdicao]?.erro && (
            <p style={{ color: 'red' }}>Erro: {statusPorItem[idEmEdicao].erro}</p>
          )}
        </form>
      )}
    </div>
  );
}
