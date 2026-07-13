// src/App.tsx

import { useState, useCallback } from 'react';
import type { FormSchema } from './types/schema';
import JsonEditor from './components/JsonEditor';
import TemplateSidebar from './components/TemplateSidebar';
import type { Template } from './components/TemplateSidebar';
import DynamicForm from './components/DynamicForm';
import { validateSchema } from './utils/schemaValidator';
import ImportExport from './components/ImportExport';
import AIMode from './components/AIMode';
import FormBuilder from './components/FormBuilder';

function App() {
  const [jsonString,       setJsonString]       = useState<string>('');
  const [parsedSchema,     setParsedSchema]     = useState<FormSchema | null>(null);
  const [parseError,       setParseError]       = useState<string | null>(null);
  const [activeTemplate,   setActiveTemplate]   = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTab,        setActiveTab]        = useState<'json' | 'ai' | 'builder'>('json');
  const [submitOutput,     setSubmitOutput]     = useState<Record<string, string | boolean | number> | null>(null);

  const handleChange = useCallback((value: string) => {
    setJsonString(value);
    setActiveTemplate(null);
    setSubmitOutput(null);

    if (!value.trim()) {
      setParsedSchema(null);
      setParseError(null);
      setValidationErrors([]);
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
      setParseError(null);
    } catch (e) {
      setParsedSchema(null);
      setParseError((e as Error).message);
      setValidationErrors([]);
      return;
    }

    const result = validateSchema(parsed);
    setValidationErrors(result.errors);
    if (result.valid) setParsedSchema(parsed as FormSchema);
    else setParsedSchema(null);
  }, []);

  const handleTemplateSelect = useCallback((template: Template) => {
    const json = JSON.stringify(template.schema, null, 2);
    setActiveTemplate(template.id);
    setJsonString(json);
    setParsedSchema(template.schema);
    setParseError(null);
    setValidationErrors([]);
    setSubmitOutput(null);
  }, []);

  const isValid = !parseError && validationErrors.length === 0 && !!parsedSchema;

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: '#0d0e14', color: '#e2e4f3',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>

      {/* ── Header ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '48px', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6, background: '#4f46e5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>F</div>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#fff', letterSpacing: '-0.01em' }}>
            FormCraft
          </span>
          <span style={{
            fontSize: 11, color: '#4b5563', padding: '2px 8px',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4,
          }}>
            Dynamic Form Generator
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#6b7280' }}>
          {parsedSchema && (
            <>
              <span>{parsedSchema.fields.length} field{parsedSchema.fields.length !== 1 ? 's' : ''}</span>
              <span style={{ color: '#34d399' }}>● live</span>
            </>
          )}
        </div>
      </header>

      {/* ── Three-panel body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: Template sidebar */}
        <aside style={{
          width: 192, flexShrink: 0, padding: 12, overflowY: 'auto',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}>
          <TemplateSidebar
            onSelect={handleTemplateSelect}
            activeId={activeTemplate}
          />
        </aside>

        {/* Center: JSON editor + AI mode + Builder */}
        <div style={{
          width: 420, flexShrink: 0, padding: 16, overflowY: 'auto',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>

          {/* Tab toggle */}
          <div style={{
            display: 'flex', gap: 2, padding: 3, borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            {(['json', 'ai', 'builder'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11,
                  fontWeight: 500, border: 'none', cursor: 'pointer',
                  background: activeTab === tab ? '#4f46e5' : 'transparent',
                  color: activeTab === tab ? '#fff' : '#6b7280',
                  transition: 'all 0.15s',
                }}
              >
                {tab === 'json' ? '{ } JSON' : tab === 'ai' ? '✦ AI' : '🛠 Builder'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'json' ? (
            <>
              <JsonEditor
                value={jsonString}
                onChange={handleChange}
                parseError={parseError}
                validationErrors={validationErrors}
                isValid={isValid}
              />
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <ImportExport
                jsonString={jsonString}
                onImport={handleChange}
              />
            </>
          ) : activeTab === 'ai' ? (
            <AIMode
              onSchema={json => {
                handleChange(json);
                setActiveTab('json');
              }}
            />
          ) : (
            <FormBuilder
              schema={parsedSchema}
              onChange={handleChange}
            />
          )}
        </div>

        {/* Right: Form preview */}
        <div style={{
          flex: 1, padding: 32, overflowY: 'auto',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        }}>
          {parsedSchema ? (
            <div style={{
              background: '#13141e',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: 24,
              width: '100%', maxWidth: 400,
            }}>
              <DynamicForm
                key={JSON.stringify(parsedSchema)}
                schema={parsedSchema}
                onSubmit={data => setSubmitOutput(data)}
              />
              {submitOutput && (
                <div style={{
                  marginTop: 16, padding: 12, borderRadius: 8,
                  background: 'rgba(52,211,153,0.06)',
                  border: '1px solid rgba(52,211,153,0.2)',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 8,
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: '#34d399',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>
                      Output
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(submitOutput, null, 2))}
                      style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre style={{
                    margin: 0, fontSize: 11, color: '#34d399',
                    fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                  }}>
                    {JSON.stringify(submitOutput, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', height: '100%', width: '100%',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, margin: '0 auto 12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: '#374151',
                }}>⬚</div>
                <p style={{ margin: '0 0 4px', fontSize: 13, color: '#6b7280' }}>Form preview appears here</p>
                <p style={{ margin: 0, fontSize: 11, color: '#374151' }}>Pick a template or write a schema</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;