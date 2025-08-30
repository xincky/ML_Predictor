// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://44.244.204.29:5000'; // Usa tu IP pública

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/api/register`, { email, password });
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000); // Redirigir al login después de 2 segundos
    } catch (err) {
      setError(err.response?.data?.msg || 'Error en el registro.');
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '350px', padding: '40px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Crear Cuenta</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ marginBottom: '10px', padding: '8px' }}/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required style={{ marginBottom: '20px', padding: '8px' }}/>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit">Registrarse</button>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;