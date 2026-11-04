import CrudUsuarios from './aula07/CrudUsuarios';
import PainelTestes from './aula07/PainelTestes';
import { ListaProdutos } from './components/ListaProdutos';

export default function App() {
  return (
    <>
      <PainelTestes />
      <hr />
      <CrudUsuarios />
      <hr />
      <h1>Meus Produtos (API Express)</h1>
      <ListaProdutos />
    </>
  );
}
