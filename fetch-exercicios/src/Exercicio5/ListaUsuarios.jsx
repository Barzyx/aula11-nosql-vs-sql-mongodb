function ListaUsuarios({ usuarios }) {
  return (
    <ul>
      {usuarios.map((usuario) => (
        <li key={usuario.id}>
          {usuario.first_name} {usuario.last_name}
        </li>
      ))}
    </ul>
  );
}

export default ListaUsuarios;