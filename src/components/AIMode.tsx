// src/components/AIMode.tsx

import { useState } from 'react';

interface Props {
  onSchema: (json: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are a form schema generator for FormCraft.
The user describes a form. You respond with ONLY valid JSON — no explanation, no markdown, no backticks.

Schema structure:
{
  "title": "string",
  "submitLabel": "string (optional)",
  "fields": [
    {
      "id": "unique_snake_case",
      "label": "Human readable label",
      "type": "text|email|password|number|textarea|select|radio|checkbox",
      "placeholder": "optional",
      "validation": {
        "required": true,
        "min": 0,
        "max": 100,
        "minLength": 8,
        "maxLength": 500,
        "message": "Custom error text"
      },
      "options": [{ "label": "Display text", "value": "submitted_value" }],
      "showIf": { "field": "other_field_id", "equals": true }
    }
  ]
}

Rules:
- id must be unique snake_case with no spaces
- options is required for select and radio types
- Only output JSON. Nothing else. No markdown. No explanation. No backticks.`;

const SUGGESTIONS = [
  'Login form',
  'Registration with phone and gender',
  'Job application form',
  'Product feedback survey',
  'Event signup with ticket types',
];

export default function AIMode({ onSchema }: Props) {
  const [input,       setInput]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string>('');
  const [history,     setHistory]     = useState<Message[]>([]);

  const generate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setRawResponse('');

    const userMsg: Message = { role: 'user', content: input.trim() };
    const messages = [...history, userMsg];

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          max_tokens: 1000,
          temperature: 0.1,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
          ],
        }),
      });

      const data = await res.json();

      // API-level error (bad key, quota, etc.)
      if (data.error) {
        setError(`API Error: ${data.error.message}`);
        setLoading(false);
        return;
      }

      const text: string = data.choices?.[0]?.message?.content ?? '';
      setRawResponse(text);

      let schema: unknown;
      try {
        const cleaned = text
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('No JSON object found');
        schema = JSON.parse(match[0]);
      } catch {
        setError('AI returned invalid JSON. See raw response below.');
        setLoading(false);
        return;
      }

      setHistory([...messages, { role: 'assistant', content: text }]);
      setInput('');
      setRawResponse('');
      onSchema(JSON.stringify(schema, null, 2));
    } catch (e) {
      setError(`Request failed: ${(e as Error).message}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          AI Generate
        </p>
        {history.length > 0 && (
          <button onClick={() => setHistory([])}
            style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>
            clear
          </button>
        )}
      </div>

      {history.filter(m => m.role === 'user').length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 80, overflowY: 'auto' }}>
          {history.filter(m => m.role === 'user').map((m, i) => (
            <div key={i} style={{
              fontSize: 11, color: '#9ca3af', padding: '4px 8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6,
            }}>
              <span style={{ color: '#4b5563', marginRight: 6 }}>You</span>
              {m.content}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="Describe the form you need…"
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 8, fontSize: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#e2e4f3', outline: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        />
        <button
          onClick={generate}
          disabled={loading || !input.trim()}
          style={{
            width: 36, height: 36, borderRadius: 8, border: 'none',
            background: loading || !input.trim() ? 'rgba(79,70,229,0.3)' : '#4f46e5',
            color: '#fff', fontSize: 14,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {loading ? '…' : '→'}
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ margin: 0, fontSize: 11, color: '#f87171' }}>⚠ {error}</p>
          {rawResponse && (
            <pre style={{
              margin: 0, fontSize: 10, color: '#6b7280',
              whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              maxHeight: 120, overflowY: 'auto',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 6, padding: 8,
            }}>
              {rawResponse}
            </pre>
          )}
        </div>
      )}

      {history.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ margin: 0, fontSize: 11, color: '#4b5563' }}>Try a prompt:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setInput(s)}
                style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#9ca3af', cursor: 'pointer',
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <p style={{ margin: 0, fontSize: 11, color: '#4b5563' }}>
          Schema loaded → edit in JSON tab or send a follow-up
        </p>
      )}

    </div>
  );
}