// src/types/schema.ts

/**
 * Every field type the system will ever support.
 * Phases 4-5 implement text|email|password|number.
 * Phase 9 adds textarea|select|radio|checkbox.
 * Declared in full now so the validator never needs a schema change.
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox';

/**
 * One option inside a select or radio field.
 * label = what the user sees. value = what gets submitted.
 * Never use string[] — you can't separate "United States" from "US".
 */
export interface FieldOption {
  label: string;
  value: string;
}

/**
 * Conditional visibility rule (Phase 12).
 * "Show this field only when field `field` equals `equals`."
 * Driven by react-hook-form's watch() at runtime.
 */
export interface ShowIfCondition {
  field: string;
  equals: string | boolean | number;
}

/**
 * Per-field validation rules (Phase 6).
 * Maps 1-to-1 onto react-hook-form register() options.
 * pattern is a string because JSON cannot serialise RegExp objects.
 * DynamicField converts it to new RegExp(pattern) at render time.
 */
export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
}

/**
 * A single form field.
 * id       — unique key; becomes the key in the submitted JSON output.
 * label    — visible label rendered above the input.
 * type     — controls which element DynamicField renders.
 * options  — required for select and radio. Ignored by all other types.
 * showIf   — optional conditional visibility (Phase 12).
 */
export interface FieldSchema {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string | boolean | number;
  options?: FieldOption[];
  validation?: FieldValidation;
  showIf?: ShowIfCondition;
}

/**
 * Top-level form schema — what the JSON textarea must produce.
 * title       — rendered as the form heading.
 * fields      — ordered list; DynamicForm maps over this.
 * submitLabel — button text. Defaults to "Submit" if omitted.
 */
export interface FormSchema {
  title: string;
  fields: FieldSchema[];
  submitLabel?: string;
}
