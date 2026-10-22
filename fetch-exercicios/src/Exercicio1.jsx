import { useEffect, useState } from 'react';

function Exercicio1() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function buscarPosts() {
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/posts');
        const dados = await resposta.json();
        setPosts(dados.slice(0, 10));
      } catch (erro) {
        console.error('Erro ao buscar posts:', erro);
      }
    }

    buscarPosts();
  }, []);

  return (
    <div>
      <h1>Exercício 1 — Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            #{post.id} — {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Exercicio1;
