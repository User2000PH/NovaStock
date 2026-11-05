import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:3000/api';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('react_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem('react_token')
  );

  async function iniciarSesion(email, password) {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'No se pudo iniciar sesión.');
    }

    localStorage.setItem('react_token', datos.token);
    localStorage.setItem('react_usuario', JSON.stringify(datos.usuario));

    setToken(datos.token);
    setUsuario(datos.usuario);

    return datos.usuario;
  }

  function cerrarSesion() {
    localStorage.removeItem('react_token');
    localStorage.removeItem('react_usuario');

    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        iniciarSesion,
        cerrarSesion,
        estaAutenticado: Boolean(token)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}