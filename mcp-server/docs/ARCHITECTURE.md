# Architecture

## Goals

1. **Accurate** — the data exposed to AI must reflect the actual library API.
2. **Fast** — startup must be near-instant so the MCP client doesn't time out.
3. **Self-contained** — no live file system reads at runtime; everything ships in the npm tarball.
4. **Maintainable** — a contributor editing `lib/` should not have to touch the MCP server code.

## Data flow

```
   ┌────────────────────────────────────────────┐
   │            Pre-build (dev machine)         │
   │                                            │
   │   lib/main.ts ──┐                          │
   │   lib/components/  │                        │
   │     <Name>/.vue   ├─→ parsers ─┐           │
   │   lib/components/  │           │           │
   │     <Name>/index.ts│           ▼           │
   │                   │  src/data/component-   │
   │   snippets/*.json ┤  registry.json (built)│
   │                   │           │           │
   │                   └───────────┤           │
   │                               ▼           │
   │                   src/data/snippet-      │
   │                   registry.json           │
   └────────────────────────────────────────────┘
                            │
                            │ npm publish (includes dist/ + src/data/*.json)
                            ▼
   ┌────────────────────────────────────────────┐
   │          Consumer (any project)            │
   │                                            │
   │   npx -y @sutekitechid/sicoco-v3-next-mcp  │
   │       │                                    │
   │       ▼                                    │
   │   src/index.ts                            │
   │       ├─ loadComponentRegistry()          │
   │       ├─ loadSnippetRegistry()            │
   │       ├─ createServer()                   │
   │       └─ StdioServerTransport             │
   │                                            │
   │   ┌──────────────────────────────────┐     │
   │   │ McpServer                        │     │
   │   │   ├─ 8 tools (tools/index.ts)    │     │
   │   │   └─ 2 resources (resources/...)  │     │
   │   └──────────────────────────────────┘     │
   └────────────────────────────────────────────┘
```

## Why pre-build, not runtime extraction?

| Option | Pros | Cons |
|--------|------|------|
| **Pre-build to static JSON** *(chosen)* | ~50-200KB shipped, instant startup, no parsing at consumer | Registry can drift if contributor forgets to run build:registry |
| Runtime extraction | Always in sync | ~3-5MB dep (`vue-eslint-parser`, `@typescript-eslint/parser`), 200-500ms startup, fragile across Node versions |

The drift risk is mitigated by three lifecycle hooks: `prebuild`, `prepare`, and `prepublishOnly` all re-run the build script. A contributor who edits `lib/` and runs `npm run build` is automatically in sync.

## Why `vue-eslint-parser` + `@typescript-eslint/parser`?

We tried a pure-regex approach first. It handled 80% of components but failed on:

- `defineProps<Props>()` where `Props` is a referenced type (not an inline literal)
- `interface Foo extends Bar { ... }` (inheritance)
- `withDefaults(defineProps<Props>(), {...})` wrappers
- JSDoc attached to property signatures (no `leadingComments` in ESTree)

A full AST parser handles all of these correctly at the cost of ~3MB of dev-time dependencies (not shipped to the consumer).

## Folder layout

```
mcp-server/
├── src/
│   ├── index.ts                  # entry: load + connect stdio
│   ├── server.ts                 # McpServer factory
│   ├── types.ts                  # ComponentMeta, SnippetMeta, ...
│   ├── data/
│   │   ├── categories.ts         # hand-maintained category mapping
│   │   ├── loader.ts             # reads the bundled JSON
│   │   ├── component-registry.json  # GENERATED, gitignored
│   │   └── snippet-registry.json    # GENERATED, gitignored
│   ├── parsers/
│   │   ├── vue-api-extractor.ts  # <script setup> → props/emits/slots
│   │   └── cva-extractor.ts      # cva() block → variants
│   ├── utils/
│   │   ├── fuzzy-match.ts        # subsequence + prefix scoring
│   │   └── sfc-validator.ts      # light SFC check
│   ├── tools/
│   │   └── index.ts              # all 8 tool handlers
│   └── resources/
│       └── index.ts              # 2 resource handlers
├── scripts/
│   └── build-registry.ts         # pre-build CLI
├── tests/                        # vitest
└── docs/                         # markdown
```

## Known limitations

- **Reka-UI / Vue internal props** — props forwarded from `reka-ui` (e.g. `PrimitiveProps`) are not expanded; the snippet just shows them as their interface name.
- **Type references across files** — `import type { Foo } from './types'` is not followed. Components that rely on types from other files will have empty `props`. Local `interface` and `type` declarations in the same file are resolved.
- **Variant discovery** — the `cva-extractor` is regex-based. It works for the patterns used in this codebase but may miss unconventional `cva()` calls (e.g. with `as` casts or deeply nested `compoundVariants`).
- **Sub-component inference** — `SCardHeader` is assumed to be a sub-component of `SCard` because the names share a prefix. The heuristic is `name.startsWith(parent) && rest starts with uppercase`. It works for this codebase but is not bulletproof.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for how to extend the parsers.
