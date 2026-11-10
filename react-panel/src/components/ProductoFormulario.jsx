function ProductoFormulario({
  producto,
  setProducto,
  guardarProducto,
  cancelarEdicion,
  editando
}) {
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setProducto({
      ...producto,
      [name]: value
    });
  };

  return (
    <form
      className="formulario-producto"
      onSubmit={(e) => {
        e.preventDefault();
        guardarProducto();
      }}
    >
      <h2>{editando ? 'Editar producto' : 'Registrar producto'}</h2>

      <label>Código</label>
      <input
        name="codigo"
        value={producto.codigo}
        onChange={manejarCambio}
        required
      />

      <label>Nombre</label>
      <input
        name="nombre"
        value={producto.nombre}
        onChange={manejarCambio}
        required
      />

      <label>Categoría</label>
      <input
        name="categoria"
        value={producto.categoria}
        onChange={manejarCambio}
        required
      />

      <label>Precio</label>
      <input
        name="precio"
        type="number"
        min="0"
        step="0.01"
        value={producto.precio}
        onChange={manejarCambio}
        required
      />

      <label>Stock</label>
      <input
        name="stock"
        type="number"
        min="0"
        step="1"
        value={producto.stock}
        onChange={manejarCambio}
        required
      />

      <label>Descripción</label>
      <textarea
        name="descripcion"
        value={producto.descripcion}
        onChange={manejarCambio}
      />

      <div className="acciones-formulario">
        <button type="submit">
          {editando ? 'Guardar cambios' : 'Registrar producto'}
        </button>

        {editando && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductoFormulario;