# Sicoco Vue Component Library

Vue 3 + TypeScript + Vite component library, plus an MCP server for AI-assisted development.

> Two sub-projects live in this repository:
>
> - `lib/` — the component library itself (`@sutekitechid/sicoco-v3-next`)
> - `mcp-server/` — the Model Context Protocol server (`@sutekitechid/sicoco-v3-next-mcp`)

## 🚀 Quick links

- [Library snippets](./snippets/) — VSCode IntelliSense for every component
- [MCP server](./mcp-server/) — AI assistant integration (Claude Code, Cursor, Copilot)

## 📁 Repo layout

```
.
├── lib/                  # Component source (SButton, SDatePicker, ...)
├── snippets/             # VSCode snippets (42 files, 279 prefixes)
├── scripts/              # build helpers
├── mcp-server/           # MCP server (separate package)
│   ├── src/              # TypeScript source
│   ├── docs/             # ARCHITECTURE, TOOLS, CONSUMER_GUIDE, ...
│   ├── tests/            # Vitest unit tests
│   ├── scripts/          # build-registry.ts
│   └── package.json      # @sutekitechid/sicoco-v3-next-mcp
├── cypress/              # E2E tests for the library
├── dist/                 # built library (gitignored)
└── package.json          # root config for the library
```

## 🤖 MCP Server (for AI assistants)

The `mcp-server/` sub-project exposes the library's API and snippets to AI coding assistants via [Model Context Protocol](https://modelcontextprotocol.io).

See [`mcp-server/README.md`](./mcp-server/README.md) for installation and quick start, and [`mcp-server/docs/`](./mcp-server/docs/) for the full reference.

```bash
# Quick smoke test
cd mcp-server
npm install
npm run build:registry
npm run build
npm test
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"0.1.0"}}}' \
  | node dist/src/index.js
```

## 📦 Snippets

VSCode-style snippets for every component live in `./snippets/`. After adding or editing a snippet:

```bash
npm run postbuild
```

This merges all `snippets/*.json` into:

- `dist/snippets/components.code-snippets`
- `.vscode/components.code-snippets`

The latter is consumed by VSCode for IntelliSense in this repo; the former is copied to consumer projects by the `postinstall` script in `@sutekitechid/sicoco-v3-next`.

### Snippet conventions

- **Tag**: PascalCase + `S` prefix, e.g. `<STooltip>`
- **Atribut**: Vue-style kebab-case for multi-word, e.g. `:close-on-click-outside`, `:data-cy`
- **Import**: 1 baris jika ≤4 item, multi-line jika >4
- **Indent body**: 2 spasi
- **Placeholder bernomor**: unik per snippet

## 🛠 Library development

This template uses Vue 3 + TypeScript + Vite. The library uses `<script setup>` SFCs — see the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup).

```bash
# Library dev
npm run dev           # vite dev server
npm run build         # vue-tsc + vite build
npm run test          # vitest
npm run test:e2e      # cypress
npm run lint          # eslint
```

## 📝 License

Private — internal to `@sutekitechid`.
