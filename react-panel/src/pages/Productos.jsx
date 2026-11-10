import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useProductos } from '../context/ProductosContext';

import Buscador from '../components/Buscador';
import ProductoFormulario from '../components/ProductoFormulario';
import ProductoTabla from '../components/ProductoTabla';

const productoInicial = {
  codigo: '',
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
  descripcion: ''
};

function Productos() {
  const { usuario, cerrarSesion } = useAuth();

  const {
    productos,
    cargando,
    error,
    guardarProducto,
    eliminarProducto
  } = useProductos();

  const navigate = useNavigate();

  const [producto, setProducto] = useState(productoInicial);
  const [productoEditando, setProductoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const rol = usuario?.rol;

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase().trim();

    return productos.filter((p) =>
      [p.codigo, p.nombre, p.categoria].some((valor) =>
        String(valor || '').toLowerCase().includes(termino)
      )
    );
  }, [productos, busqueda]);

  const manejarGuardado = async () => {
    try {
      setMensajeError('');

      await guardarProducto(
        producto,
        productoEditando
      );

      setProducto(productoInicial);
      setProductoEditando(null);

      alert(
        productoEditando
          ? 'Producto actualizado.'
          : 'Producto registrado.'
      );
    } catch (error) {
      setMensajeError(error.message);
    }
  };

  const editarProducto = (productoSeleccionado) => {
    setProducto({
      codigo: productoSeleccionado.codigo || '',
      nombre: productoSeleccionado.nombre || '',
      categoria: productoSeleccionado.categoria || '',
      precio: productoSeleccionado.precio ?? '',
      stock: productoSeleccionado.stock ?? '',
      descripcion: productoSeleccionado.descripcion || ''
    });

    setProductoEditando(productoSeleccionado._id);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const cancelarEdicion = () => {
    setProducto(productoInicial);
    setProductoEditando(null);
  };

  const manejarEliminacion = async (id) => {
    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este producto?'
    );

    if (!confirmar) return;

    try {
      setMensajeError('');

      await eliminarProducto(id);

      alert('Producto eliminado.');
    } catch (error) {
      setMensajeError(error.message);
    }
  };

  const salir = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <main className="contenedor-productos">
      <header className="encabezado-panel">
        <div>
          <h1>NovaStock - Panel React</h1>
          <p>
            Usuario: {usuario?.nombre} | Rol: {rol}
          </p>
        </div>

        <button type="button" onClick={salir}>
          Cerrar sesión
        </button>
      </header>

      {(error || mensajeError) && (
        <p className="mensaje-error">
          {mensajeError || error}
        </p>
      )}

      {(rol === 'admin' || rol === 'editor') && (
        <ProductoFormulario
          producto={producto}
          setProducto={setProducto}
          guardarProducto={manejarGuardado}
          cancelarEdicion={cancelarEdicion}
          editando={Boolean(productoEditando)}
        />
      )}

      <Buscador
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductoTabla
          productos={productosFiltrados}
          editarProducto={editarProducto}
          eliminarProducto={manejarEliminacion}
          rol={rol}
        />
      )}
    </main>
  );
}

export default Productos;