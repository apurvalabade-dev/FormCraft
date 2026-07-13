// src/utils/schemaValidator.ts

import type { FormSchema } from '../types/schema';

const VALID_TYPES = [
  'text',
  'email',
  'password',
  'number',
  'textarea',
  'select',
  'radio',
  'checkbox',
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSchema(data: unknown): ValidationResult {
  const errors: string[] = [];

  // Must be a non-null object
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, errors: ['Schema must be a JSON object'] };
  }

  const schema = data as Record<string, unknown>;

  // title
  if (!schema.title || typeof schema.title !== 'string') {
    errors.push('"title" is required and must be a string');
  }

  // fields
  if (!Array.isArray(schema.fields)) {
    errors.push('"fields" must be an array');
    return { valid: false, errors };
  }

  if (schema.fields.length === 0) {
    errors.push('"fields" array cannot be empty');
  }

  const seenIds = new Set<string>();
  const allIds = new Set<string>(
    (schema.fields as Record<string, unknown>[])
      .map((f) => f.id)
      .filter((id): id is string => typeof id === 'string')
  );

  (schema.fields as Record<string, unknown>[]).forEach((field, i) => {
    const p = `fields[${i}]`;

    // id
    if (!field.id) {
      errors.push(`${p}: "id" is required`);
    } else if (typeof field.id !== 'string') {
      errors.push(`${p}: "id" must be a string`);
    } else if (seenIds.has(field.id)) {
      errors.push(`${p}: duplicate id "${field.id}"`);
    } else {
      seenIds.add(field.id);
    }

    // label
    if (!field.label) {
      errors.push(`${p}: "label" is required`);
    }

    // type
    if (!field.type) {
      errors.push(`${p}: "type" is required`);
    } else if (!VALID_TYPES.includes(field.type as string)) {
      errors.push(
        `${p}: invalid type "${field.type}". Must be one of: ${VALID_TYPES.join(
          ', '
        )}`
      );
    }

    // options required for select and radio
    if (field.type === 'select' || field.type === 'radio') {
      const opts = field.options as unknown[];
      if (!Array.isArray(opts) || opts.length === 0) {
        errors.push(
          `${p}: "${field.type}" requires a non-empty "options" array`
        );
      }
    }
    // showIf
    if (field.showIf) {
      const showIf = field.showIf as Record<string, unknown>;
      if (!showIf.field) {
        errors.push(`${p}.showIf: "field" is required`);
      } else if (!allIds.has(showIf.field as string)) {
        errors.push(`${p}.showIf: references unknown field "${showIf.field}"`);
      }
      if (showIf.equals === undefined) {
        errors.push(`${p}.showIf: "equals" is required`);
      }
    }
  });

  // submitLabel must be string if present
  if (
    schema.submitLabel !== undefined &&
    typeof schema.submitLabel !== 'string'
  ) {
    errors.push('"submitLabel" must be a string');
  }

  return { valid: errors.length === 0, errors };
}
