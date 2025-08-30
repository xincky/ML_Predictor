// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Reemplaza con la IP pública de tu servidor
  const API_URL = 'http://44.244.204.29:5000';

  // Override CSS global para esta página
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.boxSizing = 'border-box';
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.maxWidth = 'none';
      rootElement.style.margin = '0';
      rootElement.style.padding = '0';
      rootElement.style.textAlign = 'initial';
    }
    
    return () => {
      // Restaurar si es necesario
      if (rootElement) {
        rootElement.style.maxWidth = '1280px';
        rootElement.style.margin = '0 auto';
        rootElement.style.padding = '2rem';
        rootElement.style.textAlign = 'center';
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email: email,
        password: password
      });
      
      localStorage.setItem('authToken', response.data.access_token);
      localStorage.setItem('userRole', response.data.rol);//Control de roles
      navigate('/dashboard');

    } catch (err) {
      setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      console.error('Error de login:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '16px 20px',
    borderRadius: '12px',
    border: '2px solid transparent',
    backgroundColor: '#f8fafc',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#667eea',
    backgroundColor: 'white',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  };

  return (
    <>
      <style>{`
        #root {
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          text-align: initial !important;
          width: 100% !important;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }
        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        .floating-shapes::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
          animation: float 20s ease-in-out infinite;
        }
        .floating-shapes::after {
          content: '';
          position: absolute;
          bottom: -50%;
          right: -50%;
          width: 150%;
          height: 150%;
          background: radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%);
          animation: float 25s ease-in-out infinite reverse;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(15px) rotate(240deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .login-container {
          animation: slideInUp 0.6s ease-out;
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        {/* Animated Background */}
        <div className="floating-shapes"></div>

        {/* Login Form */}
        <div 
          className="login-container"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            width: '100%',
            maxWidth: '450px', 
            padding: '50px 40px', 
            backgroundColor: 'white',
            borderRadius: '24px', 
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}>
              🩺
            </div>
            
            <h2 style={{ 
              margin: '0 0 12px 0',
              color: '#1a202c',
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              Bienvenido
            </h2>
            
            <p style={{ 
              margin: '0',
              color: '#64748b',
              fontSize: '16px',
              fontWeight: '400'
            }}>
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ marginBottom: '24px' }}>
              <label 
                htmlFor="email" 
                style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}
              >
                CORREO ELECTRÓNICO
              </label>
              
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  style={inputStyle}
                  onFocus={(e) => {
                    Object.assign(e.target.style, {
                      borderColor: '#667eea',
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    });
                  }}
                  onBlur={(e) => {
                    Object.assign(e.target.style, {
                      borderColor: 'transparent',
                      backgroundColor: '#f8fafc',
                      boxShadow: 'none'
                    });
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '20px'
                }}>
                  📧
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '32px' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}
              >
                CONTRASEÑA
              </label>
              
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={(e) => {
                    Object.assign(e.target.style, {
                      borderColor: '#667eea',
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    });
                  }}
                  onBlur={(e) => {
                    Object.assign(e.target.style, {
                      borderColor: 'transparent',
                      backgroundColor: '#f8fafc',
                      boxShadow: 'none'
                    });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div style={{ 
                color: '#dc2626', 
                textAlign: 'center',
                marginBottom: '24px',
                fontSize: '14px',
                padding: '16px',
                backgroundColor: '#fef2f2',
                borderRadius: '12px',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ marginRight: '8px', fontSize: '16px' }}>⚠️</span>
                {error}
              </div>
            )}
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: '18px 24px', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                background: loading 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '16px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.7 : 1,
                boxShadow: loading 
                  ? 'none'
                  : '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {loading && <div className="spinner"></div>}
              {loading ? 'Iniciando Sesión...' : '✨ Iniciar Sesión'}
            </button>

          </form>

          {/* Additional Links */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '14px',
              margin: '0'
            }}>
              ¿Problemas para acceder? 
              <span style={{ 
                color: '#667eea', 
                fontWeight: '600',
                cursor: 'pointer',
                marginLeft: '6px'
              }}>
                Contacta soporte
              </span>
            </p>
          </div>
        </div>
        </div>
    </>
  );
}

export default LoginPage;