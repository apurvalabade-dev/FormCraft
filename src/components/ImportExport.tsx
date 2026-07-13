// src/components/ImportExport.tsx

import { type FC, useRef } from 'react';

interface Props {
  jsonString: string;
  onImport: (value: string) => void;
}

const btnStyle = (color: string): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '7px 12px', borderRadius: 8, fontSize: 12,
  fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
  border: `1px solid ${color}`,
  background: 'transparent', color,
});

const ImportExport: FC<Props> = ({ jsonString, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!jsonString.trim()) return;
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      onImport(text);
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported
    e.target.value = '';
  };

  const handleCopy = () => {
    if (!jsonString.trim()) return;
    navigator.clipboard.writeText(jsonString);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{
        fontSize: 11, fontWeight: 600, color: '#4b5563',
        textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
      }}>
        Schema
      </p>

      {/* Import */}
      <button
        style={btnStyle('rgba(255,255,255,0.2)')}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span>↑</span> Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />

      {/* Export */}
      <button
        style={btnStyle(jsonString.trim() ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)')}
        onClick={handleExport}
        disabled={!jsonString.trim()}
        onMouseEnter={e => {
          if (jsonString.trim())
            e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
        }}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span>↓</span> Export
      </button>

      {/* Copy */}
      <button
        style={btnStyle(jsonString.trim() ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.1)')}
        onClick={handleCopy}
        disabled={!jsonString.trim()}
        onMouseEnter={e => {
          if (jsonString.trim())
            e.currentTarget.style.background = 'rgba(52,211,153,0.05)';
        }}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span>⎘</span> Copy
      </button>
    </div>
  );
};

export default ImportExport;