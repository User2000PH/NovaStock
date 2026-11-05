import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductosProvider } from './context/ProductosContext';

import Login from './pages/Login';
import Productos from './pages/Productos';

function RutaProtegida({ children }) {
  const { estaAutenticado } = useAuth();

  return estaAutenticado
    ? children
    : <Navigate to="/login" replace />;
}

function Rutas() {
  const { estaAutenticado } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          estaAutenticado
            ? <Navigate to="/productos" replace />
            : <Login />
        }
      />

      <Route
        path="/productos"
        element={
          <RutaProtegida>
            <Productos />
          </RutaProtegida>
        }
      />

      <Route path="*" element={<Navigate to="/productos" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ProductosProvider>
          <Rutas />
        </ProductosProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}