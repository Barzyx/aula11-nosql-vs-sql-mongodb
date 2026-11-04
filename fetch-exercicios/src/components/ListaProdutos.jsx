import { useEffect, useState } from 'react'

// ⚠️ ADAPTE à sua API Express real (porta e caminho).
// Dá para sobrescrever criando um arquivo .env na raiz com:
// VITE_API_URL=http://localhost:3000/produtos
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/produtos'

export function ListaProdutos() {
  // produtos: null = ainda não carregou
  const [produtos, setProdutos] = useState(null)
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    // Cancela a requisição se o componente sumir antes da resposta
    const ctrl = new AbortController()

    fetch(API_URL, { signal: ctrl.signal })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status} ${resp.statusText}`)
        }
        return resp.json()
      })
      .then((dados) => {
        // Aceita array direto [...] ou envolto { produtos: [...] }
        const lista = Array.isArray(dados) ? dados : (dados.produtos ?? [])
        setProdutos(lista)
        setCarregando(false)
      })
      .catch((e) => {
        if (e.name === 'AbortError') return // cancelada, não é erro
        setErro(e.message)
        setCarregando(false)
      })

    return () => ctrl.abort()
  }, [])

  // Quatro estados possíveis na tela
  if (carregando) return <p>Carregando produtos…</p>
  if (erro) return <p role="alert">Erro: {erro}</p>
  if (!produtos || produtos.length === 0) return <p>Nenhum produto encontrado.</p>

  return (
    <ul aria-label="lista de produtos">
      {produtos.map((item) => (
        <li key={item._id ?? item.id}>
          {item.nome} — R$ {item.preco}
          {item.ativo === undefined ? '' : item.ativo ? ' (ativo)' : ' (inativo)'}
        </li>
      ))}
    </ul>
  )
}
