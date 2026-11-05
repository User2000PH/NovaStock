function Buscador({ busqueda, setBusqueda }) {
  return (
    <div className="buscador">
      <input
        type="text"
        placeholder="Buscar por código, nombre o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </div>
  );
}

export default Buscador;