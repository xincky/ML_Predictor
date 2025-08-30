// src/pages/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ReportsPage() {
  const [diagnostics, setDiagnostics] = useState([]);
  const [error, setError] = useState('');

  const API_URL = 'http://44.244.204.29:5000'; // Usa tu IP pública

  // Cargar la lista de diagnósticos al inicio
  useEffect(() => {
    const fetchDiagnostics = async () => {
      const token = localStorage.getItem('authToken');
      try {
        // Este endpoint aún no lo hemos creado, pero lo haremos.
        const response = await axios.get(`${API_URL}/api/diagnostics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDiagnostics(response.data);
      } catch (err) {
        setError('No se pudieron cargar los reportes.');
        console.error("Error al cargar diagnósticos", err);
      }
    };
    fetchDiagnostics();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/dashboard">← Volver al Dashboard</Link>
      <h1>Panel de Control de Diagnósticos</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Fecha</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Nombre del Paciente</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Resultado</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Confianza</th>
          </tr>
        </thead>
        <tbody>
          {diagnostics.map(diag => (
            <tr key={diag.id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{diag.id}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{diag.fecha}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{diag.paciente_nombre}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{diag.resultado}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{diag.confianza?.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportsPage;