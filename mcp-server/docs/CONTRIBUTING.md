# Contributing

This guide is for maintainers of the Sicoco component library who want to extend the MCP server.

## Add a new tool

1. Open `src/tools/index.ts`.
2. Write a function following the existing pattern:

   ```ts
   function registerMyTool(server: McpServer, deps: ToolDeps) {
     server.tool(
       'my_tool',
       'Short description for AI.',
       {
         query: z.string().describe('What the AI passes in.'),
       },
       async ({ query }) => {
         // ... do something with deps.components or deps.snippets ...
         return ok(JSON.stringify({ result: '...' }, null, 2))
       },
     )
   }
   ```

3. Call it from `registerTools(...)`:

   ```ts
   registerMyTool(server, deps)
   ```

4. Write a Vitest test in `tests/tools/my-tool.test.ts`.

5. Document the new tool in `docs/TOOLS.md`.

6. Run `npm test` and `npm run build` to verify.

---

## Add a new resource

1. Open `src/resources/index.ts`.
2. Register a new resource with `server.resource(...)`:

   ```ts
   server.resource(
     'my-resource',
     new ResourceTemplate('my-resource://{id}', { list: undefined }),
     async (uri, params) => {
       const id = String(params.id ?? '')
       const data = lookupData(id)
       if (!data) throw new Error(`my-resource "..." not found`)
       return {
         contents: [{
           uri: uri.href,
           mimeType: 'application/json',
           text: JSON.stringify(data, null, 2),
         }],
       }
     },
   )
   ```

3. Document the URI scheme in `docs/RESOURCES.md`.

---

## Add or update a component category

Component categories are hand-maintained in `src/data/categories.ts`.

1. Open `src/data/categories.ts`.
2. Add the component name to the appropriate `Category` key.
3. Re-run `npm run build:registry` to update the bundled JSON.

The categories are exposed in `list_components` and used to color-code the response.

---

## Improve a parser

### Add a new prop-type shape

The vue-api-extractor handles:

- Inline type literals: `defineProps<{ name: string }>()`
- Referenced type aliases: `defineProps<Props>()` where `Props` is local
- `withDefaults(defineProps<Props>(), {...})` wrappers
- `interface Foo extends Bar { ... }` (one level of extension)
- JSDoc descriptions on property signatures

To support a new shape (e.g. generic constraints, `Pick<>`/`Omit<>`), edit the relevant `appendPropsFromTypeLiteral` and `resolveToTypeLiteral` functions in `src/parsers/vue-api-extractor.ts`. Add a fixture to `tests/fixtures/` and a test in `tests/parsers/vue-api-extractor.test.ts`.

### Improve variant detection

The cva-extractor is regex-based. It works for the patterns used in this codebase. To support a new pattern, edit `src/parsers/cva-extractor.ts` and add a test in `tests/parsers/cva-extractor.test.ts`.

---

## Refresh the registry

Whenever you edit `lib/components/...` or `snippets/*.json`, regenerate the registry:

```bash
cd mcp-server
npm run build:registry
```

This is also run automatically by the `prebuild`, `prepare`, and `prepublishOnly` lifecycle hooks.

---

## Testing

```bash
cd mcp-server
npm test              # one-shot
npm run test:watch    # watch mode
npm run lint          # tsc --noEmit (type check only)
```

Coverage is reported by `vitest --coverage` (requires `npm i -D @vitest/coverage-v8`).

---

## Coding style

- TypeScript, ESM, `strict: true`.
- No `any` unless wrapping dynamic JSON; prefer `unknown` plus type guards.
- Prefer small, focused files. The largest file in the project should be `src/parsers/vue-api-extractor.ts`.
- Tests live next to `tests/` mirroring the `src/` tree.
- All public types live in `src/types.ts`; tool/resource handlers should not export their own types.
