function ProductoTabla({
  productos,
  editarProducto,
  eliminarProducto,
  rol
}) {
  return (
    <div className="tabla-contenedor">
      <h2>Inventario de productos</h2>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan="6">No se encontraron productos.</td>
            </tr>
          ) : (
            productos.map((producto) => (
              <tr key={producto._id}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>S/ {Number(producto.precio).toFixed(2)}</td>
                <td>{producto.stock}</td>
                <td>
                  {(rol === 'admin' || rol === 'editor') && (
                    <button
                      type="button"
                      onClick={() => editarProducto(producto)}
                    >
                      Editar
                    </button>
                  )}

                  {rol === 'admin' && (
                    <button
                      type="button"
                      onClick={() => eliminarProducto(producto._id)}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductoTabla;