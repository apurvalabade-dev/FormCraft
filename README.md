# FormCraft — Dynamic Form Generator

A production-quality form generation platform built with React, TypeScript, Vite, and Tailwind. Generate, preview, and export real forms from JSON schemas — with a visual builder, AI generation, and 8 pre-built templates.

---

## Live Demo

> https://form-craft-3bo4-pink.vercel.app 
---

## Features

### Three Ways to Build a Form

| Mode               | How it works                                                         |
| ------------------ | -------------------------------------------------------------------- |
| **JSON Editor**    | Write a schema manually, live validation with instant error feedback |
| **AI Generate**    | Describe the form in plain English, Claude generates the schema      |
| **Visual Builder** | Click to add fields, reorder, delete — no JSON required              |

All three modes feed the same rendering engine — every form is driven by a typed `FormSchema` contract.

### Template Library

8 production-ready schemas, one click to load:

- 🔐 Login
- 👤 Registration
- ✉️ Contact Us
- ⭐ Feedback Survey
- 💼 Job Application
- ⚙️ Profile Update
- 🔑 Password Reset
- 🎟️ Event Registration

### Form Engine

- **8 field types** — `text`, `email`, `password`, `number`, `textarea`, `select`, `radio`, `checkbox`
- **Validation** — required, minLength, maxLength, min, max, pattern, custom error messages
- **Conditional fields** — `showIf` rules hide/show fields based on other field values, driven by `watch()`
- **Submit output** — rendered as JSON, copyable to clipboard
- **Schema validator** — catches missing `id`, invalid `type`, duplicate IDs, `select` without options, broken `showIf` references before the form renders

### Import / Export

- Export current schema as `.json`
- Import any `.json` schema file
- Copy schema to clipboard

---

## Tech Stack

| Layer           | Technology                                 |
| --------------- | ------------------------------------------ |
| Frontend        | React 18, TypeScript, Vite                 |
| Styling         | Inline styles (no Tailwind dependency)     |
| Form handling   | Custom validation engine                   |
| AI generation   | Anthropic Claude API (`claude-sonnet-4-6`) |
| Dev environment | StackBlitz                                 |

---

## Project Structure

```
src/
├── components/
│   ├── JsonEditor.tsx        # Schema textarea with live valid/invalid feedback
│   ├── DynamicForm.tsx       # Form renderer — maps schema to DynamicField list
│   ├── DynamicField.tsx      # Renders individual field by type
│   ├── TemplateSidebar.tsx   # 8 pre-built schema templates
│   ├── FormBuilder.tsx       # Visual field adder — no JSON required
│   ├── AIMode.tsx            # Anthropic API integration — describe → schema
│   └── ImportExport.tsx      # Load/save/copy schema JSON
│
├── types/
│   └── schema.ts             # FormSchema, FieldSchema, FieldType, FieldValidation,
│                             # FieldOption, ShowIfCondition — foundation for all phases
│
├── utils/
│   └── schemaValidator.ts    # Validates parsed JSON before it reaches DynamicForm
│
└── App.tsx                   # Three-panel layout — sidebar, editor, preview
```

---

## Schema Format

```json
{
  "title": "Registration",
  "submitLabel": "Create Account",
  "fields": [
    {
      "id": "full_name",
      "label": "Full Name",
      "type": "text",
      "placeholder": "John Doe",
      "validation": {
        "required": true,
        "minLength": 2,
        "message": "Please enter your full name"
      }
    },
    {
      "id": "email",
      "label": "Email",
      "type": "email",
      "validation": { "required": true }
    },
    {
      "id": "employed",
      "label": "Currently employed?",
      "type": "checkbox"
    },
    {
      "id": "company",
      "label": "Company Name",
      "type": "text",
      "showIf": {
        "field": "employed",
        "equals": true
      }
    },
    {
      "id": "country",
      "label": "Country",
      "type": "select",
      "options": [
        { "label": "India", "value": "IN" },
        { "label": "United States", "value": "US" }
      ],
      "validation": { "required": true }
    }
  ]
}
```

### Supported Field Types

| Type       | Renders as                              |
| ---------- | --------------------------------------- |
| `text`     | Text input                              |
| `email`    | Email input                             |
| `password` | Password input                          |
| `number`   | Number input (supports min/max)         |
| `textarea` | Multi-line text area                    |
| `select`   | Dropdown (requires `options`)           |
| `radio`    | Radio button group (requires `options`) |
| `checkbox` | Single checkbox (returns boolean)       |

### Validation Rules

```json
{
  "validation": {
    "required": true,
    "min": 0,
    "max": 100,
    "minLength": 8,
    "maxLength": 500,
    "pattern": "^[a-zA-Z]+$",
    "message": "Custom error message shown on failure"
  }
}
```

### Conditional Visibility

```json
{
  "showIf": {
    "field": "other_field_id",
    "equals": true
  }
}
```

Hidden fields are excluded from the submit output automatically.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/FormCraft.git
cd FormCraft

# Install dependencies
npm install

# Add environment variable for AI mode
echo "VITE_ANTHROPIC_API_KEY=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" > .env

# Start dev server
npm run dev
```

> AI Generate requires an Anthropic API key from [console.anthropic.com](https://console.anthropic.com). All other features work without it.

---

## Architecture Decisions

**Single schema contract drives everything.** `src/types/schema.ts` was written in Phase 1 to anticipate all 14 phases — `FieldType` union includes all 8 types, `FieldOption` uses `{ label, value }` objects not bare strings, and `ShowIfCondition` accepts `string | boolean | number` so checkbox conditions work correctly. No breaking changes were needed as the project evolved.

**Validator runs before the renderer.** `schemaValidator.ts` catches structural problems — duplicate IDs, unknown `type` values, `select` without `options`, broken `showIf` references — before the schema reaches `DynamicForm`. This means the renderer never receives malformed input.

**Three input modes, one output.** JSON editor, AI generator, and visual builder all call `handleChange(json)` in `App.tsx`, which parses and validates before setting `parsedSchema`. The preview always reflects the validated schema regardless of how it was produced.

---

## Roadmap

- [ ] Free AI provider (Gemini / Groq) for zero-cost generation
- [ ] Tailwind CSS migration
- [ ] Multi-step / wizard forms
- [ ] Form sharing via URL (schema in query params)
- [ ] Backend integration — POST submit output to an API endpoint

---

## Author

Built by Apurva Labade — MCA student at Shivaji University, Kolhapur.
Portfolio project demonstrating full-stack React architecture and production-quality engineering.

```

```
