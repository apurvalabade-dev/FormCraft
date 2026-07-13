// src/components/DynamicField.tsx

import { type FC } from 'react';
import type { FieldSchema } from '../types/schema';

interface Props {
  field: FieldSchema;
  value: string | boolean | number;
  onChange: (id: string, value: string | boolean | number) => void;
  error?: string | null;
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid',
  borderColor: hasError ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)',
  background: hasError ? 'rgba(248,113,113,0.05)' : 'rgba(255,255,255,0.05)',
  color: '#e2e4f3',
  fontSize: 13,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, background 0.15s',
});

const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 13,
  fontWeight: 500,
  color: '#d1d5db',
  marginBottom: 6,
};

const DynamicField: FC<Props> = ({ field, value, onChange, error }) => {

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <input
            type={field.type}
            value={value as string}
            placeholder={field.placeholder}
            onChange={e => onChange(field.id, e.target.value)}
            style={inputStyle(!!error)}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            onChange={e => onChange(field.id, e.target.value === '' ? '' : Number(e.target.value))}
            style={inputStyle(!!error)}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value as string}
            placeholder={field.placeholder}
            rows={3}
            onChange={e => onChange(field.id, e.target.value)}
            style={{ ...inputStyle(!!error), resize: 'none', lineHeight: 1.6 }}
          />
        );

      case 'select':
        return (
          <select
            value={value as string}
            onChange={e => onChange(field.id, e.target.value)}
            style={{ ...inputStyle(!!error), cursor: 'pointer' }}
          >
            <option value="">Choose an option…</option>
            {field.options?.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {field.options?.map(o => (
              <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={field.id}
                  value={o.value}
                  checked={value === o.value}
                  onChange={() => onChange(field.id, o.value)}
                  style={{ accentColor: '#4f46e5', width: 14, height: 14 }}
                />
                <span style={{ fontSize: 13, color: '#d1d5db' }}>{o.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 4 }}>
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={e => onChange(field.id, e.target.checked)}
              style={{ accentColor: '#4f46e5', width: 14, height: 14 }}
            />
            <span style={{ fontSize: 13, color: '#d1d5db' }}>
              {field.placeholder || field.label}
            </span>
          </label>
        );

      default:
        return (
          <div style={{ fontSize: 12, color: '#f87171' }}>
            Unsupported type: {field.type}
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Label — hidden for checkbox since label is inline */}
      {field.type !== 'checkbox' && (
        <label style={labelStyle}>
          {field.label}
          {field.validation?.required && (
            <span style={{ color: '#f87171', fontSize: 11 }}>*</span>
          )}
        </label>
      )}

      {renderInput()}

      {/* Error message */}
      {error && (
        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#f87171', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>⚠</span> {error}
        </p>
      )}

    </div>
  );
};

export default DynamicField;