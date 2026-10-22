import { useEffect, useRef, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const FORM_VAZIO = { name: "", email: "" };

export default function Exercicio5CrudCompleto() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(false);
  const [erroLista, setErroLista] = useState(null);

  const [formVisivel, setFormVisivel] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState(null);
  const [form, setForm] = useState(FORM_VAZIO);

  const [statusPorItem, setStatusPorItem] = useState({});

  const controllersAtivos = useRef(new Set());

  useEffect(() => {
    carregarUsuarios();

    return () => {
      controllersAtivos.current.forEach((controller) => controller.abort());
      controllersAtivos.current.clear();
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

  async function carregarUsuarios() {
    const controller = criarControllerRastreado();
    setCarregandoLista(true);
    setErroLista(null);

    try {
      const res = await fetch(API_URL, { signal: controller.signal });
      if (!res.ok) throw new Error(`Falha ao carregar usuários (status ${res.status})`);
      const data = await res.json();
      setUsuarios(data);
    } catch (erroRequisicao) {
      if (erroRequisicao.name !== "AbortError") {
        setErroLista(erroRequisicao.message);
      }
    } finally {
      liberarController(controller);
      setCarregandoLista(false);
    }
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
    const chave = emEdicao ? idEmEdicao : "novo";
    const controller = criarControllerRastreado();

    definirStatus(chave, { carregando: true, erro: null });

    try {
      const res = await fetch(emEdicao ? `${API_URL}/${idEmEdicao}` : API_URL, {
        method: emEdicao ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Falha ao salvar usuário (status ${res.status})`);
      const usuarioSalvo = await res.json();

      if (emEdicao) {
        setUsuarios((atuais) =>
          atuais.map((u) => (u.id === idEmEdicao ? { ...u, ...usuarioSalvo } : u))
        );
      } else {
        setUsuarios((atuais) => [
          ...atuais,
          { ...usuarioSalvo, id: usuarioSalvo.id ?? Date.now() },
        ]);
      }

      definirStatus(chave, { carregando: false, erro: null });
      fecharForm();
    } catch (erroRequisicao) {
      if (erroRequisicao.name !== "AbortError") {
        definirStatus(chave, { carregando: false, erro: erroRequisicao.message });
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
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Falha ao excluir usuário (status ${res.status})`);
      definirStatus(id, { carregando: false, erro: null });
    } catch (erroRequisicao) {
      if (erroRequisicao.name !== "AbortError") {
        definirStatus(id, { carregando: false, erro: erroRequisicao.message });
        setUsuarios(listaAnterior);
      }
    } finally {
      liberarController(controller);
    }
  }

  return (
    <div>
      <h2>Exercício 5 — Mini-CRUD completa</h2>

      <button onClick={abrirNovo}>Novo</button>

      {carregandoLista && <p>Carregando usuários...</p>}
      {erroLista && <p style={{ color: "red" }}>Erro: {erroLista}</p>}

      <ul>
        {usuarios.map((usuario) => {
          const status = statusPorItem[usuario.id];
          return (
            <li key={usuario.id}>
              {usuario.name} ({usuario.email})
              <button onClick={() => abrirEdicao(usuario)}>Editar</button>
              <button onClick={() => excluirUsuario(usuario.id)}>Excluir</button>
              {status?.carregando && <span> (processando...)</span>}
              {status?.erro && <p style={{ color: "red" }}>Erro: {status.erro}</p>}
            </li>
          );
        })}
      </ul>

      {formVisivel && (
        <form onSubmit={salvarForm}>
          <h3>
            {idEmEdicao !== null ? `Editando usuário #${idEmEdicao}` : "Novo usuário"}
          </h3>
          <label>
            Nome:
            <input
              type="text"
              value={form.name}
              onChange={(e) => atualizarCampo("name", e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={form.email}
              onChange={(e) => atualizarCampo("email", e.target.value)}
              required
            />
          </label>
          <button type="submit">Salvar</button>
          <button type="button" onClick={fecharForm}>
            Cancelar
          </button>

          {statusPorItem["novo"]?.erro && (
            <p style={{ color: "red" }}>Erro: {statusPorItem["novo"].erro}</p>
          )}
        </form>
      )}
    </div>
  );
}
