# Data Model

All data exposed by this MCP server is generated at build time into three static JSON files. The schemas below are the source of truth.

## `ComponentMeta`

The full API of a single exported component.

```ts
interface ComponentMeta {
  /** Public name as exported from `lib/main.ts` (e.g. "SButton"). */
  name: string

  /** Import path consumers should use. */
  importPath: string

  /** Path to the .vue file in the repo (relative to repo root). */
  sourcePath: string

  /** Top-level category: form | feedback | layout | data | overlay | typography | utility. */
  category: 'form' | 'feedback' | 'layout' | 'data' | 'overlay' | 'typography' | 'utility'

  /** Short description, pulled from the .vue file's leading JSDoc. */
  description: string

  /** All declared props. */
  props: PropMeta[]

  /** All declared emits. */
  emits: EmitMeta[]

  /** All declared slots. */
  slots: SlotMeta[]

  /** cva-style variants (empty if not applicable). */
  variants: VariantMeta[]

  /** Snippet prefixes that use this component. */
  relatedSnippets: string[]

  /** True if this is a sub-component (e.g. SCardHeader). */
  isSubComponent: boolean

  /** Parent component name, if this is a sub-component. */
  parent?: string
}
```

### `PropMeta`

```ts
interface PropMeta {
  /** Prop name as declared. */
  name: string

  /** Resolved type as a string. */
  type: string

  /** Whether the prop is required. */
  required: boolean

  /** Default value (string form), if known. */
  default?: string

  /** Description from JSDoc, if available. */
  description?: string
}
```

### `EmitMeta`

```ts
interface EmitMeta {
  /** Event name. */
  name: string

  /** Payload type as a string. */
  payload?: string

  /** Description from JSDoc, if available. */
  description?: string
}
```

### `SlotMeta`

```ts
interface SlotMeta {
  /** Slot name (default slot is "default"). */
  name: string

  /** Names of scoped-slot bindings (e.g. ["row", "index"]). */
  scope?: string[]

  /** Description from JSDoc, if available. */
  description?: string
}
```

### `VariantMeta`

```ts
interface VariantMeta {
  /** Axis name (e.g. "variant", "size"). */
  name: string

  /** Allowed values for this axis. */
  values: string[]

  /** Default value, if any. */
  default?: string
}
```

---

## `SnippetMeta`

A single VSCode-style snippet from the `snippets/` directory.

```ts
interface SnippetMeta {
  /** Snippet prefix (e.g. "sibutton:primary"). */
  prefix: string

  /** Human-friendly name shown in IntelliSense. */
  name: string

  /** Short description. */
  description: string

  /** Snippet body, joined into a single string. */
  body: string

  /** Component this snippet is associated with (inferred from prefix). */
  component?: string

  /** Snippet category for grouping. */
  category: 'form' | 'feedback' | 'layout' | 'data' | 'overlay' | 'typography' | 'utility' | 'component' | 'utility'
}
```

---

## `UtilMeta`

The full signature of a single utility function exported from the library.

```ts
interface UtilMeta {
  /** Function name as exported. */
  name: string

  /** Import path consumers should use. */
  importPath: string

  /** Top-level category: merge | currency | file | pagination | sanitize. */
  category: 'merge' | 'currency' | 'file' | 'pagination' | 'sanitize'

  /** Short description. */
  description: string

  /** Function parameters, in declaration order. */
  parameters: ParamMeta[]

  /** Return type as a string. */
  returnType: string

  /** Snippet prefixes that use this util. */
  relatedSnippets: string[]
}
```

### `ParamMeta`

```ts
interface ParamMeta {
  /** Parameter name. */
  name: string

  /** Resolved type as a string. */
  type: string

  /** Whether the parameter is required. */
  required: boolean

  /** Default value (string form), if known. */
  default?: string

  /** Description, if available. */
  description?: string
}
```

---

## Registry files

All three registry files (`component-registry.json`, `snippet-registry.json`, `util-registry.json`) share this envelope:

```ts
interface Registry {
  version: 1
  libraryVersion: string  // from package.json
  generatedAt: string     // ISO 8601
  components?: Record<string, ComponentMeta>  // component-registry.json
  snippets?: Record<string, SnippetMeta>      // snippet-registry.json
  utils?: Record<string, UtilMeta>            // util-registry.json
}
```
