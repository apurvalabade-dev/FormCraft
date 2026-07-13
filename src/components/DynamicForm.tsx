// src/components/DynamicForm.tsx

import { type FC, useState, useEffect, useCallback } from 'react';
import type { FormSchema } from '../types/schema';
import DynamicField from './DynamicField';

interface Props {
  schema: FormSchema;
  onSubmit: (data: Record<string, string | boolean | number>) => void;
}

type FormValues = Record<string, string | boolean | number>;
type FormErrors = Record<string, string | null>;

function checkVisibility(
  values: FormValues,
  field: FormSchema['fields'][number]
): boolean {
  if (!field.showIf) return true;
  const watchValue = values[field.showIf.field];
  return (
    watchValue === field.showIf.equals ||
    String(watchValue) === String(field.showIf.equals)
  );
}

const DynamicForm: FC<Props> = ({ schema, onSubmit }) => {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const init: FormValues = {};
    schema.fields.forEach((f) => {
      if (f.defaultValue !== undefined) init[f.id] = f.defaultValue;
      else if (f.type === 'checkbox') init[f.id] = false;
      else init[f.id] = '';
    });
    setValues(init);
    setErrors({});
    setSubmitted(false);
  }, [schema]);

  const handleChange = useCallback(
    (id: string, value: string | boolean | number) => {
      setValues((prev) => ({ ...prev, [id]: value }));
      setErrors((prev) => ({ ...prev, [id]: null }));
    },
    []
  );

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};

    schema.fields.forEach((f) => {
      // Skip hidden fields
      if (!checkVisibility(values, f)) return;

      const v = f.validation;
      if (!v) return;

      const val = values[f.id];
      const empty =
        val === '' || val === null || val === undefined || val === false;

      if (v.required && empty) {
        errs[f.id] = v.message ?? `${f.label} is required`;
        return;
      }

      if (!empty) {
        if (v.minLength && String(val).length < v.minLength)
          errs[f.id] =
            v.message ?? `Minimum ${v.minLength} characters required`;
        if (v.maxLength && String(val).length > v.maxLength)
          errs[f.id] = v.message ?? `Maximum ${v.maxLength} characters allowed`;
        if (v.min !== undefined && Number(val) < v.min)
          errs[f.id] = v.message ?? `Minimum value is ${v.min}`;
        if (v.max !== undefined && Number(val) > v.max)
          errs[f.id] = v.message ?? `Maximum value is ${v.max}`;
        if (v.pattern && !new RegExp(v.pattern).test(String(val)))
          errs[f.id] = v.message ?? 'Invalid format';
      }
    });

    return errs;
  }, [schema, values]);

  const handleSubmit = useCallback(() => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Only include visible fields in output
    const output: Record<string, string | boolean | number> = {};
    schema.fields.forEach((f) => {
      if (checkVisibility(values, f)) output[f.id] = values[f.id] ?? '';
    });

    setSubmitted(true);
    onSubmit(output);
  }, [validate, schema, values, onSubmit]);

  if (submitted)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(52,211,153,0.15)',
              border: '1px solid rgba(52,211,153,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#34d399',
            }}
          >
            ✓
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#34d399' }}>
            Form submitted successfully
          </span>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          style={{
            alignSelf: 'flex-start',
            fontSize: 12,
            color: '#6b7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          ← Fill again
        </button>
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.01em',
          }}
        >
          {schema.title}
        </h2>
        <div
          style={{
            width: 32,
            height: 2,
            background: '#4f46e5',
            borderRadius: 2,
            marginTop: 8,
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {schema.fields.map((field) => {
          if (!checkVisibility(values, field)) return null;
          return (
            <DynamicField
              key={field.id}
              field={field}
              value={values[field.id] ?? ''}
              onChange={handleChange}
              error={errors[field.id]}
            />
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: '#4f46e5',
          border: '1px solid rgba(99,102,241,0.5)',
          borderRadius: 8,
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#4338ca')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#4f46e5')}
      >
        {schema.submitLabel ?? 'Submit'}
      </button>
    </div>
  );
};

export default DynamicForm;
