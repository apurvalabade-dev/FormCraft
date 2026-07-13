// src/components/FormBuilder.tsx

import { useState } from 'react';
import type {
  FormSchema,
  FieldSchema,
  FieldType,
  FieldOption,
} from '../types/schema';

interface Props {
  schema: FormSchema | null;
  onChange: (json: string) => void;
}

const FIELD_TYPES: FieldType[] = [
  'text',
  'email',
  'password',
  'number',
  'textarea',
  'select',
  'radio',
  'checkbox',
];

const NEEDS_OPTIONS = (t: FieldType) => t === 'select' || t === 'radio';

function emptySchema(): FormSchema {
  return { title: 'New Form', submitLabel: 'Submit', fields: [] };
}

function slugify(label: string): string {
  return (
    label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'field'
  );
}

export default function FormBuilder({ schema, onChange }: Props) {
  const current = schema ?? emptySchema();

  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState('');
  const [type, setType] = useState<FieldType>('text');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState<FieldOption[]>([
    { label: '', value: '' },
  ]);

  const pushSchema = (updated: FormSchema) => {
    onChange(JSON.stringify(updated, null, 2));
  };

  const updateTitle = (title: string) => {
    pushSchema({ ...current, title });
  };

  const addField = () => {
    if (!label.trim()) return;

    const id = slugify(label);
    const field: FieldSchema = {
      id,
      label: label.trim(),
      type,
      ...(required ? { validation: { required: true } } : {}),
      ...(NEEDS_OPTIONS(type)
        ? { options: options.filter((o) => o.label.trim() && o.value.trim()) }
        : {}),
    };

    if (NEEDS_OPTIONS(type) && (!field.options || field.options.length === 0))
      return;

    pushSchema({ ...current, fields: [...current.fields, field] });

    // reset form
    setLabel('');
    setType('text');
    setRequired(false);
    setOptions([{ label: '', value: '' }]);
    setShowAdd(false);
  };

  const deleteField = (id: string) => {
    pushSchema({
      ...current,
      fields: current.fields.filter((f) => f.id !== id),
    });
  };

  const moveField = (index: number, dir: -1 | 1) => {
    const next = [...current.fields];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    pushSchema({ ...current, fields: next });
  };

  const updateOption = (i: number, key: 'label' | 'value', val: string) => {
    setOptions((prev) =>
      prev.map((o, idx) => (idx === i ? { ...o, [key]: val } : o))
    );
  };

  const addOptionRow = () =>
    setOptions((prev) => [...prev, { label: '', value: '' }]);
  const removeOptionRow = (i: number) =>
    setOptions((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Form title */}
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#4b5563',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 6px',
          }}
        >
          Form Title
        </p>
        <input
          type="text"
          value={current.title}
          onChange={(e) => updateTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 13,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#e2e4f3',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Field list */}
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#4b5563',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 6px',
          }}
        >
          Fields ({current.fields.length})
        </p>

        {current.fields.length === 0 && (
          <p style={{ fontSize: 12, color: '#374151', padding: '8px 0' }}>
            No fields yet. Add one below.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {current.fields.map((f, i) => (
            <div
              key={f.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontSize: 12, color: '#e2e4f3', fontWeight: 500 }}
                >
                  {f.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#6b7280',
                    fontFamily: 'monospace',
                  }}
                >
                  {f.id} · {f.type}
                  {f.validation?.required ? ' · required' : ''}
                </div>
              </div>
              <button
                onClick={() => moveField(i, -1)}
                disabled={i === 0}
                style={{
                  background: 'none',
                  border: 'none',
                  color: i === 0 ? '#2a2c3a' : '#6b7280',
                  cursor: i === 0 ? 'default' : 'pointer',
                  fontSize: 13,
                }}
              >
                ↑
              </button>
              <button
                onClick={() => moveField(i, 1)}
                disabled={i === current.fields.length - 1}
                style={{
                  background: 'none',
                  border: 'none',
                  color:
                    i === current.fields.length - 1 ? '#2a2c3a' : '#6b7280',
                  cursor:
                    i === current.fields.length - 1 ? 'default' : 'pointer',
                  fontSize: 13,
                }}
              >
                ↓
              </button>
              <button
                onClick={() => deleteField(f.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add field toggle */}
      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 500,
            border: '1px dashed rgba(99,102,241,0.4)',
            background: 'rgba(99,102,241,0.06)',
            color: '#a5b4fc',
            cursor: 'pointer',
          }}
        >
          + Add Field
        </button>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: 12,
            borderRadius: 10,
            border: '1px solid rgba(99,102,241,0.25)',
            background: 'rgba(99,102,241,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: '#a5b4fc' }}>
              New Field
            </span>
            <button
              onClick={() => setShowAdd(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder="Field label (e.g. Full Name)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 6,
              fontSize: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e4f3',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as FieldType)}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 6,
              fontSize: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e4f3',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {FIELD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {NEEDS_OPTIONS(type) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, color: '#6b7280' }}>Options</span>
              {options.map((o, i) => (
                <div key={i} style={{ display: 'flex', gap: 6 }}>
                  <input
                    placeholder="Label"
                    value={o.label}
                    onChange={(e) => updateOption(i, 'label', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#e2e4f3',
                      outline: 'none',
                    }}
                  />
                  <input
                    placeholder="Value"
                    value={o.value}
                    onChange={(e) => updateOption(i, 'value', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#e2e4f3',
                      outline: 'none',
                    }}
                  />
                  {options.length > 1 && (
                    <button
                      onClick={() => removeOptionRow(i)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#f87171',
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOptionRow}
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 11,
                  color: '#a5b4fc',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                + add option
              </button>
            </div>
          )}

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              style={{ accentColor: '#4f46e5', width: 13, height: 13 }}
            />
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              Required field
            </span>
          </label>

          <button
            onClick={addField}
            disabled={!label.trim()}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              border: 'none',
              cursor: label.trim() ? 'pointer' : 'not-allowed',
              background: label.trim() ? '#4f46e5' : 'rgba(79,70,229,0.3)',
              color: '#fff',
            }}
          >
            Add Field
          </button>
        </div>
      )}
    </div>
  );
}
