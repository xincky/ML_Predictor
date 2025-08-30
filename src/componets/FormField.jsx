// src/components/FormField.jsx
import React from 'react';

const FormField = ({ label, name, type = 'text', value, onChange, options = [], step }) => {
  const inputStyle = { width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ccc', borderRadius: '4px' };
  const labelStyle = { display: 'block', marginBottom: '16px', fontWeight: 'bold' };

  if (type === 'select') {
    return (
      <label style={labelStyle}>
        {label}
        <select name={name} value={value} onChange={onChange} style={inputStyle}>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label style={labelStyle}>
      {label}
      <input type={type} name={name} value={value} onChange={onChange} step={step} style={inputStyle} />
    </label>
  );
};

export default FormField;