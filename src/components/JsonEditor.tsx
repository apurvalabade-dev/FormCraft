// src/components/JsonEditor.tsx

import type { FC } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  parseError: string | null;
  validationErrors: string[];
  isValid: boolean;
}
const PLACEHOLDER = `{
  "title": "My Form",
  "submitLabel": "Submit",
  "fields": [
    {
      "id": "name",
      "label": "Full Name",
      "type": "text",
      "placeholder": "John Doe",
      "validation": { "required": true }
    }
  ]
}`;

const JsonEditor: FC<Props> = ({ value, onChange, parseError, validationErrors,isValid }) => {
  const empty = !value.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Schema JSON
        </span>
        {!empty && (
          <span style={{
            fontSize: '11px', fontWeight: 500, padding: '2px 8px',
            borderRadius: '999px', border: '1px solid',
            color:       isValid ? '#34d399' : '#f87171',
            background:  isValid ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
            borderColor: isValid ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)',
          }}>
            {isValid ? '✓ valid' : parseError ? '✗ invalid json' : '✗ schema error'}
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        spellCheck={false}
        style={{
          flex: 1,
          width: '100%',
          minHeight: '260px',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid',
          borderColor: empty
            ? 'rgba(255,255,255,0.08)'
            : isValid
            ? 'rgba(52,211,153,0.25)'
            : 'rgba(248,113,113,0.25)',
          background: empty
            ? 'rgba(255,255,255,0.03)'
            : isValid
            ? 'rgba(52,211,153,0.03)'
            : 'rgba(248,113,113,0.03)',
          color: '#e2e4f3',
          fontSize: '12px',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          lineHeight: 1.6,
          resize: 'none',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {/* Error message */}
      {parseError && (
        <div style={{
          padding: '8px 12px', borderRadius: '8px',
          background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.2)',
        }}>
          <p style={{ margin: 0, fontSize: '11px', color: '#f87171', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {parseError}
          </p>
        </div>
      )}

{!parseError && validationErrors.length > 0 && (
  <div style={{
    padding: '8px 12px', borderRadius: 8,
    background: 'rgba(251,191,36,0.08)',
    border: '1px solid rgba(251,191,36,0.2)',
    display: 'flex', flexDirection: 'column', gap: 4,
  }}>
    {validationErrors.map((err, i) => (
      <p key={i} style={{ margin: 0, fontSize: 11, color: '#fbbf24', fontFamily: 'monospace' }}>
        • {err}
      </p>
    ))}
  </div>
)}
    </div>
  );
};

export default JsonEditor;