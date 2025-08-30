// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_pacientes: 0,
    total_diagnosticos: 0,
    diagnosticos_por_tipo: []
  });
  const [userRole, setUserRole] = useState(''); // Estado para el rol

  const [loading, setLoading] = useState(true);

  const API_URL = 'http://44.244.204.29:5000'; // Tu IP pública

  useEffect(() => {
    // Leemos el rol del usuario al cargar la página
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    const fetchStats = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get(`${API_URL}/api/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);
 
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole'); // <-- Borra también el rol
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* --- El header ahora está DENTRO del return --- */}
      <header style={{ 
        background: 'white',
        padding: '20px 40px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <h1>Dashboard Médico</h1>
        <div>
          <Link to="/reports" style={{ marginRight: '15px' }}>
            <button>Ver Reportes</button>
          </Link>
          {userRole === 'admin' && (
            <Link to="/admin/users" style={{ marginRight: '15px' }}>
              <button>Gestionar Usuarios</button>
            </Link>
          )}
          <Link to="/patients" style={{ marginRight: '15px' }}>
            <button>Gestionar Pacientes</button>
          </Link>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{ padding: '40px' }}>
        {/* Tarjetas de Estadísticas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '30px', 
          marginBottom: '40px'
        }}>
          <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <h2>Total de Pacientes</h2>
            <p style={{ fontSize: '42px', fontWeight: 'bold', margin: '10px 0', color: '#667eea' }}>
              {stats.total_pacientes}
            </p>
          </div>

          <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <h2>Total de Diagnósticos</h2>
            <p style={{ fontSize: '42px', fontWeight: 'bold', margin: '10px 0', color: '#11998e' }}>
              {stats.total_diagnosticos}
            </p>
          </div>
        </div>

        {/* Sección de la Gráfica */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 30px 0', textAlign: 'center', fontSize: '20px' }}>
            Distribución de Diagnósticos
          </h3>
          
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={stats.diagnosticos_por_tipo} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Cantidad" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Botón de Acción Principal */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/predict">
            <button style={{ 
              padding: '15px 30px', 
              fontSize: '18px', 
              cursor: 'pointer', 
              background: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px' 
            }}>
              + Realizar Nuevo Diagnóstico
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;