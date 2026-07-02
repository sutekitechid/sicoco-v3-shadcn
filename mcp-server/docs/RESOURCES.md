# Resources Reference

Resources are URI-addressable chunks of static data. AI assistants can `read_resource` to fetch a specific component, snippet, or utility function.

---

## `component://<name>`

Returns the JSON `ComponentMeta` for a single component.

### URI scheme

```
component://<Name>
```

| Example | Description |
|---------|-------------|
| `component://SButton` | Full metadata for `SButton` |
| `component://SDatePicker` | Full metadata for `SDatePicker` |

### Response

```json
{
  "name": "SButton",
  "importPath": "@sutekitechid/sicoco-v3-next",
  "sourcePath": "lib/components/button/Button.vue",
  "category": "form",
  "description": "...",
  "props": [...],
  "emits": [...],
  "slots": [...],
  "variants": [...],
  "relatedSnippets": ["sibutton", "sibutton:primary", ...],
  "isSubComponent": false
}
```

MIME type: `application/json`.

### Errors

- `Component "..." not found` — the name is not in the registry.

---

## `snippet://<prefix>`

Returns the JSON `SnippetMeta` for a single VSCode snippet.

### URI scheme

```
snippet://<prefix>
```

| Example | Description |
|---------|-------------|
| `snippet://sibutton:primary` | The "primary variant" snippet for `SButton` |
| `snippet://sidatepicker:required` | The "required" snippet for `SDatePicker` |

### Response

```json
{
  "prefix": "sibutton:primary",
  "name": "SButton Primary",
  "description": "Sicoco Button with primary variant",
  "body": "<SButton variant=\"primary\">$1</SButton>",
  "component": "SButton",
  "category": "form"
}
```

MIME type: `application/json`.

### Errors

- `Snippet "..." not found` — the prefix is not in the registry.

---

## `util://<name>`

Returns the JSON `UtilMeta` for a single utility function.

### URI scheme

```
util://<FunctionName>
```

| Example | Description |
|---------|-------------|
| `util://cn` | `cn()` — Tailwind class merger |
| `util://formatCurrency` | `formatCurrency()` — currency formatter |
| `util://getTotalPages` | `getTotalPages()` — pagination math |

### Response

```json
{
  "name": "formatCurrency",
  "importPath": "@sutekitechid/sicoco-v3-next",
  "category": "currency",
  "description": "Format a number as a localized currency string.",
  "parameters": [
    { "name": "value", "type": "string | number | null | undefined", "required": true, "description": "..." }
  ],
  "returnType": "string",
  "relatedSnippets": ["si-formatcurrency"]
}
```

MIME type: `application/json`.

### Errors

- `Util "..." not found` — the function name is not in the registry.
