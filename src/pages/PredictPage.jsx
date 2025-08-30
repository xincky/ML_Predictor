// src/pages/PredictPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import FormField from '../components/FormField'; // Importamos el componente reutilizable

function PredictPage() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Estado inicial del formulario con todos los campos
  const [formData, setFormData] = useState({
    age: 41,
    sex: 'F',
    on_thyroxine: 'f',
    query_on_thyroxine: 'f',
    on_antithyroid_medication: 'f',
    sick: 'f',
    pregnant: 'f',
    thyroid_surgery: 'f',
    I131_treatment: 'f',
    query_hypothyroid: 'f',
    query_hyperthyroid: 'f',
    lithium: 'f',
    goitre: 'f',
    tumor: 'f',
    hypopituitary: 'f',
    psych: 'f',
    TSH_measured: 't',
    TSH: 2.1,
    T3_measured: 't',
    T3: 2.0,
    TT4_measured: 't',
    TT4: 118.0,
    T4U_measured: 't',
    T4U: 1.1,
    FTI_measured: 't',
    FTI: 108.0,
    TBG_measured: 'f',
    referral_source: 'other'
  });

  const API_URL = 'http://44.244.204.29:5000'; // Usa tu IP pública

  // Cargar la lista de pacientes al montar el componente
  useEffect(() => {
    const fetchPacientes = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) { navigate('/login'); return; }
      try {
        const response = await axios.get(`${API_URL}/api/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPacientes(response.data);
        if (response.data.length > 0) {
          setSelectedPacienteId(response.data[0].id); // Seleccionar el primer paciente por defecto
        }
      } catch (err) {
        console.error("Error al cargar pacientes", err);
      }
    };
    fetchPacientes();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const token = localStorage.getItem('authToken');
    // Construir el payload asegurándose de que los valores numéricos se envíen como números
    const numericFields = ['age', 'TSH', 'T3', 'TT4', 'T4U', 'FTI'];
    const processedFormData = { ...formData };
    for (const field of numericFields) {
        if (processedFormData[field]) {
            processedFormData[field] = parseFloat(processedFormData[field]);
        }
    }

    const payload = {
      paciente_id: parseInt(selectedPacienteId),
      form_data: processedFormData
    };

    try {
      const response = await axios.post(`${API_URL}/api/predict`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
    } catch (err) {
      setError('Ocurrió un error al realizar la predicción.');
      console.error('Error de predicción:', err);
    }
  };

  // Opciones para los campos de selección
  const binaryOptions = [{ value: 't', label: 'Sí' }, { value: 'f', label: 'No' }];
  const sexOptions = [{ value: 'F', label: 'Femenino' }, { value: 'M', label: 'Masculino' }];
  const referralSourceOptions = [
      { value: 'SVI', label: 'SVI' },
      { value: 'SVHC', label: 'SVHC' },
      { value: 'other', label: 'Otro' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <Link to="/dashboard">← Volver al Dashboard</Link>
      <h1 style={{ textAlign: 'center' }}>Nuevo Diagnóstico Clínico</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', background: '#f9f9f9', padding: '30px', borderRadius: '8px', border: '1px solid #eee' }}>
        
        {/* --- SELECCIÓN DE PACIENTE --- */}
        <div style={{ gridColumn: '1 / -1' }}>
          <FormField label="Seleccionar Paciente" name="paciente" type="select" value={selectedPacienteId} onChange={(e) => setSelectedPacienteId(e.target.value)} options={pacientes.map(p => ({ value: p.id, label: p.nombre }))} />
        </div>

        {/* --- COLUMNA 1: DATOS DEMOGRÁFICOS E HISTORIAL --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h4>Datos del Paciente</h4>
          <FormField label="Edad" name="age" type="number" value={formData.age} onChange={handleChange} />
          <FormField label="Sexo" name="sex" type="select" value={formData.sex} onChange={handleChange} options={sexOptions} />
          <FormField label="Embarazada" name="pregnant" type="select" value={formData.pregnant} onChange={handleChange} options={binaryOptions} />
          <FormField label="Enfermo (Sick)" name="sick" type="select" value={formData.sick} onChange={handleChange} options={binaryOptions} />
          <FormField label="Cirugía de tiroides" name="thyroid_surgery" type="select" value={formData.thyroid_surgery} onChange={handleChange} options={binaryOptions} />
          <FormField label="Tratamiento con I131" name="I131_treatment" type="select" value={formData.I131_treatment} onChange={handleChange} options={binaryOptions} />
          <FormField label="Fuente de Referencia" name="referral_source" type="select" value={formData.referral_source} onChange={handleChange} options={referralSourceOptions} />
        </div>

        {/* --- COLUMNA 2: CONDICIONES Y SOSPECHAS CLÍNICAS --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h4>Historial y Tratamientos</h4>
          <FormField label="En tratamiento con tiroxina" name="on_thyroxine" type="select" value={formData.on_thyroxine} onChange={handleChange} options={binaryOptions} />
          <FormField label="Consulta sobre tiroxina" name="query_on_thyroxine" type="select" value={formData.query_on_thyroxine} onChange={handleChange} options={binaryOptions} />
          <FormField label="En tratamiento con antitiroideos" name="on_antithyroid_medication" type="select" value={formData.on_antithyroid_medication} onChange={handleChange} options={binaryOptions} />
          <FormField label="Tratamiento con Litio" name="lithium" type="select" value={formData.lithium} onChange={handleChange} options={binaryOptions} />
          <FormField label="Bocio (Goitre)" name="goitre" type="select" value={formData.goitre} onChange={handleChange} options={binaryOptions} />
          <FormField label="Tumor" name="tumor" type="select" value={formData.tumor} onChange={handleChange} options={binaryOptions} />
          <FormField label="Hipopituitarismo" name="hypopituitary" type="select" value={formData.hypopituitary} onChange={handleChange} options={binaryOptions} />
          <FormField label="Condición Psiquiátrica" name="psych" type="select" value={formData.psych} onChange={handleChange} options={binaryOptions} />
          <FormField label="Sospecha de Hipotiroidismo" name="query_hypothyroid" type="select" value={formData.query_hypothyroid} onChange={handleChange} options={binaryOptions} />
          <FormField label="Sospecha de Hipertiroidismo" name="query_hyperthyroid" type="select" value={formData.query_hyperthyroid} onChange={handleChange} options={binaryOptions} />
        </div>

        {/* --- COLUMNA 3: RESULTADOS DE LABORATORIO --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h4>Valores de Laboratorio</h4>
          <FormField label="¿Se midió TSH?" name="TSH_measured" type="select" value={formData.TSH_measured} onChange={handleChange} options={binaryOptions} />
          <FormField label="TSH" name="TSH" type="number" step="0.1" value={formData.TSH} onChange={handleChange} />
          <FormField label="¿Se midió T3?" name="T3_measured" type="select" value={formData.T3_measured} onChange={handleChange} options={binaryOptions} />
          <FormField label="T3" name="T3" type="number" step="0.1" value={formData.T3} onChange={handleChange} />
          <FormField label="¿Se midió TT4?" name="TT4_measured" type="select" value={formData.TT4_measured} onChange={handleChange} options={binaryOptions} />
          <FormField label="TT4" name="TT4" type="number" step="0.1" value={formData.TT4} onChange={handleChange} />
          <FormField label="¿Se midió T4U?" name="T4U_measured" type="select" value={formData.T4U_measured} onChange={handleChange} options={binaryOptions} />
          <FormField label="T4U" name="T4U" type="number" step="0.01" value={formData.T4U} onChange={handleChange} />
          <FormField label="¿Se midió FTI?" name="FTI_measured" type="select" value={formData.FTI_measured} onChange={handleChange} options={binaryOptions} />
          <FormField label="FTI" name="FTI" type="number" step="0.1" value={formData.FTI} onChange={handleChange} />
        </div>

        {/* --- BOTÓN DE ENVÍO --- */}
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px' }}>
          <button type="submit" style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
            Predecir y Guardar
          </button>
        </div>
      </form>

      {/* --- MOSTRAR RESULTADOS --- */}
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}
      
      {result && (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid', borderColor: result.prediction_code === 1 ? '#dc3545' : '#28a745', borderRadius: '8px', textAlign: 'center', background: '#fff' }}>
          <h2>Resultado del Diagnóstico</h2>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: result.prediction_code === 1 ? '#dc3545' : '#28a745' }}>
            {result.diagnosis_text}
          </p>
          <p>Confianza de la predicción: <strong>{result.confidence_probability}</strong></p>
        </div>
      )}
    </div>
  );
}

export default PredictPage;