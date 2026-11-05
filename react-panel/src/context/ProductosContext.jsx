import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ProductosContext = createContext();

const API_URL = 'http://localhost:3000/api/productos';

export function ProductosProvider({ children }) {
  const { token } = useAuth();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function cargarProductos() {
    if (!token) {
      setProductos([]);
      return;
    }

    try {
      setCargando(true);
      setError('');

      const respuesta = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al cargar productos');
      }

      setProductos(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, [token]);

  async function guardarProducto(producto, productoEditando) {
    const editando = Boolean(productoEditando);
    const id = typeof productoEditando === 'string'
      ? productoEditando
      : productoEditando?._id;

    const respuesta = await fetch(
      editando ? `${API_URL}/${id}` : API_URL,
      {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(producto)
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'Error al guardar producto');
    }

    await cargarProductos();
    return datos;
  }

  async function eliminarProducto(id) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'Error al eliminar producto');
    }

    await cargarProductos();
  }

  return (
    <ProductosContext.Provider
      value={{
        productos,
        cargando,
        error,
        guardarProducto,
        eliminarProducto,
        recargarProductos: cargarProductos
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}