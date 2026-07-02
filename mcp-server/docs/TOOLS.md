# Tools Reference

Every tool is a thin wrapper around the bundled registry. All return `text` content with a JSON payload.

---

## `list_components`

List all Sicoco components, optionally filtered by category.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `category` | enum | no | One of: `form`, `feedback`, `layout`, `data`, `overlay`, `typography`, `utility`. |
| `includeSubComponents` | boolean | no (default `false`) | If true, also include sub-components like `SCardHeader`, `SRadioGroupItem`. |

### Example

```json
{
  "name": "list_components",
  "arguments": { "category": "form" }
}
```

Response (truncated):

```json
{
  "count": 7,
  "grouped": {
    "form": [
      { "name": "SInput", "category": "form", "description": "..." },
      { "name": "SDatePicker", "category": "form", "description": "..." }
    ]
  }
}
```

---

## `get_component`

Get the full API specification of a single component.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | yes | Component name, e.g. `"SDatePicker"`. |

### Returns

The full `ComponentMeta` object — see [`DATA_MODEL.md`](DATA_MODEL.md) for the schema.

### Example

```json
{ "name": "get_component", "arguments": { "name": "SDatePicker" } }
```

---

## `search_components`

Fuzzy search by name, description, or prop keyword.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | yes | E.g. `"date"`, `"calendar with range"`. |
| `limit` | number | no (default 10) | Max results to return. |

### Example

```json
{ "name": "search_components", "arguments": { "query": "date picker", "limit": 5 } }
```

---

## `list_snippets`

List all snippets, optionally filtered by component.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `component` | string | no | Filter to a single component, e.g. `"SButton"`. |

### Example

```json
{ "name": "list_snippets", "arguments": { "component": "SButton" } }
```

---

## `get_snippet`

Retrieve a single snippet by its VSCode prefix.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prefix` | string | yes | E.g. `"sibutton:primary"`. |

If not found, returns the closest 5 prefixes that share the same base for quick typo recovery.

---

## `search_snippets`

Find snippets by use-case keyword.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | yes | E.g. `"required validation"`, `"with locale id"`. |
| `component` | string | no | Restrict to one component. |
| `limit` | number | no (default 15) | |

---

## `generate_code`

Pick the best snippet for a use-case, and emit a complete Vue code block.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `component` | string | yes | Component name, e.g. `"SDatePicker"`. |
| `useCase` | string | no | Description of the variant, e.g. `"with required validation"`. |

### Returns

```json
{
  "import": "import { SDatePicker } from '@sutekitechid/sicoco-v3-next'",
  "chosenSnippet": {
    "prefix": "sidatepicker:required",
    "name": "SDatePicker Required",
    "description": "..."
  },
  "code": "<SDatePicker v-model=\"$1\" required>...</SDatePicker>",
  "note": "Replace $1, $2, ... placeholders with your actual values."
}
```

### Example

```json
{
  "name": "generate_code",
  "arguments": { "component": "SDatePicker", "useCase": "with required validation" }
}
```

---

## `validate_usage`

Lint a Vue SFC string against the bundled component registry. Catches:

- Unknown components (only Sicoco ones are checked; user components are ignored).
- Unknown prop names on a known component.
- Missing required props.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `code` | string | yes | The Vue SFC source code. |

### Returns

```json
{
  "issueCount": 2,
  "issues": [
    { "severity": "warning", "message": "Unknown prop \"foo\" on <SButton>...", "tag": "SButton", "attr": "foo" },
    { "severity": "warning", "message": "Required prop \"value\" is missing on <SStrict>", "tag": "SStrict", "attr": "value" }
  ],
  "verdict": "ok"
}
```

### Caveats

- This is a heuristic. It does **not** understand TypeScript generics or template refs.
- It only inspects `<template>` blocks; `<script>` is ignored.
- Attributes bound via `v-bind="object"` or `:foo="bar"` are not validated for value correctness.

---

## `list_utils`

List all Sicoco utility functions, optionally filtered by category.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `category` | enum | no | One of: `merge`, `currency`, `file`, `pagination`, `sanitize`. |

### Example

```json
{ "name": "list_utils", "arguments": { "category": "file" } }
```

---

## `get_util`

Get the full signature and description of a single utility function.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | yes | E.g. `"formatCurrency"`, `"cn"`. |

### Returns

Full `UtilMeta` object — see [`DATA_MODEL.md`](DATA_MODEL.md).

---

## `search_utils`

Fuzzy search utility functions by name, description, category, or parameter.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | yes | E.g. `"currency"`, `"file size"`. |
| `limit` | number | no (default 10) | |

---

## `generate_util_code`

Generate a call expression for a utility function with sample placeholders.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | yes | E.g. `"formatCurrency"`. |

### Example

```json
{ "name": "generate_util_code", "arguments": { "name": "formatCurrency" } }
```

Response:

```json
{
  "import": "import { formatCurrency } from '@sutekitechid/sicoco-v3-next'",
  "signature": "formatCurrency(value: string | number | null | undefined): string",
  "code": "formatCurrency(/* value: string | number | null | undefined */ $1)",
  "note": "Replace the placeholders ($1, $2, ...) with actual values.",
  "relatedSnippets": ["si-formatcurrency"]
}
```
