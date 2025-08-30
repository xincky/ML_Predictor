// src/pages/UserManagementPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserManagementPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('medico');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = 'http://44.244.204.29:5000'; // Usa tu IP

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(`${API_URL}/api/register`, 
        { email, password, rol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(response.data.msg);
      // Limpiar formulario
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Error al crear el usuario. Asegúrate de tener permisos de administrador.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <Link to="/dashboard">← Volver al Dashboard</Link>
      <h1>Gestión de Usuarios</h1>
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h3>Crear Nuevo Usuario</h3>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email del nuevo usuario" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña temporal" required />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="medico">Médico</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Crear Usuario</button>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default UserManagementPage;