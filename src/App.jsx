// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Importaciones de todas tus páginas
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PredictPage from './pages/PredictPage';
import UserManagementPage from './pages/UserManagementPage';
import PatientsPage from './pages/PatientsPage';
import ReportsPage from './pages/ReportsPage';

// Importación del componente de ruta protegida
import ProtectedRoute from './components/ProtectedRoute';
// Componente Dashboard mejorado con botón de logout
/*function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Menú Principal</h2>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </nav>
      <h1>¡Bienvenido al Dashboard!</h1>
      <p>Aquí irán tus reportes y gráficas.</p>
      <Link to="/predict">
        <button>Realizar Nuevo Diagnóstico</button>
      </Link>
    </div>
  );
}
*/

 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        {/* Se elimina la ruta /register */}

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} /> {/* Nueva ruta de admin */}
        </Route>
        {/* Redirección por defecto */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;