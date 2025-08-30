// src/pages/PatientsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PatientsPage() {
  const [pacientes, setPacientes] = useState([]);
  const [nombreNuevoPaciente, setNombreNuevoPaciente] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = 'http://44.244.204.29:5000'; // Usa tu IP pública

  const fetchPacientes = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${API_URL}/api/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPacientes(response.data);
    } catch (err) {
      console.error("Error al cargar pacientes", err);
    }
  };

  // Cargar la lista de pacientes al inicio
  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('authToken');
    try {
      await axios.post(`${API_URL}/api/patients`, 
        { nombre: nombreNuevoPaciente },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Paciente "${nombreNuevoPaciente}" creado exitosamente.`);
      setNombreNuevoPaciente(''); // Limpiar el input
      fetchPacientes(); // Recargar la lista de pacientes
    } catch (err) {
      setError('Error al crear el paciente.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <Link to="/dashboard">← Volver al Dashboard</Link>
      <h1 style={{ textAlign: 'center' }}>Gestión de Pacientes</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '40px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h3>Crear Nuevo Paciente</h3>
        <input
          type="text"
          value={nombreNuevoPaciente}
          onChange={(e) => setNombreNuevoPaciente(e.target.value)}
          placeholder="Nombre completo del paciente"
          required
          style={{ width: '80%', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Crear</button>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <h3>Lista de Pacientes Existentes</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {pacientes.map(paciente => (
          <li key={paciente.id} style={{ padding: '10px', border: '1px solid #eee', marginBottom: '5px' }}>
            {paciente.nombre} (ID: {paciente.id})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientsPage;