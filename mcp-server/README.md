# `@sutekitechid/sicoco-v3-next-mcp`

> MCP server for the Sicoco Vue component library. Exposes components, props, slots, events, variants, and ready-to-paste snippets to AI assistants (Claude Code, Cursor, GitHub Copilot, …).

[![MCP](https://img.shields.io/badge/MCP-1.0-blue)](https://modelcontextprotocol.io)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-Private-lightgrey)](#)

## What is this?

`@sutekitechid/sicoco-v3-next-mcp` is a [Model Context Protocol](https://modelcontextprotocol.io) server that gives AI coding assistants first-class knowledge of the [`@sutekitechid/sicoco-v3-next`](https://www.npmjs.com/package/@sutekitechid/sicoco-v3-next) component library.

Instead of the AI guessing prop names or hallucinating variants, it can ask the MCP server:

- *"What components exist for date selection?"*
- *"Show me the props of `SDatePicker`."*
- *"Generate a `SButton` with the danger variant."*
- *"Is `<SButton variant='foo' />` valid usage?"*

## Why?

- **Less hallucination** — the AI sees the actual API.
- **Less back-and-forth** — the AI can list components, find the right snippet, and emit working code in one turn.
- **Stays in sync with the library** — a pre-build step scans the source code and emits a static registry, so the API is always current.

## Installation (consumer)

The server is published to GitHub Packages (private, scoped to `@sutekitechid`).

### 1. Authenticate with GitHub Packages

Add to your `~/.npmrc`:

```
@sutekitechid:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxxx
```

Generate a token at <https://github.com/settings/tokens> with the `read:packages` scope.

### 2. Add to your MCP client

**Claude Code** — create a `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "sicoco": {
      "command": "npx",
      "args": ["-y", "@sutekitechid/sicoco-v3-next-mcp"]
    }
  }
}
```

**Cursor** — same content in `~/.cursor/mcp.json` or `.cursor/mcp.json`.

**VSCode (Copilot)** — `.vscode/mcp.json`.

### 3. Restart your editor

The MCP server should now appear in your assistant's tool list.

## Quick start

Once connected, ask your AI:

> "List all components in the Sicoco library, grouped by category."

> "Show me the API of `SDatePicker` and generate a snippet with required validation."

> "Validate this code: `<SButton variant='foo' />`"

## Available tools

| Tool | Purpose |
|------|---------|
| `list_components` | List components, optionally filtered by category |
| `get_component` | Full API: props, slots, events, variants |
| `search_components` | Fuzzy search by name, description, or prop |
| `list_snippets` | List all snippets, optionally filtered by component |
| `get_snippet` | Retrieve the body of a single snippet |
| `search_snippets` | Find snippets by use-case keyword |
| `generate_code` | Pick the best snippet for a use-case |
| `validate_usage` | Check a Vue SFC for common mistakes |
| `list_utils` | List utility functions (cn, formatCurrency, etc.) |
| `get_util` | Full signature of one utility function |
| `search_utils` | Fuzzy search utility functions |
| `generate_util_code` | Generate a call expression for a util |

See [`docs/TOOLS.md`](docs/TOOLS.md) for the full reference.

## Available resources

| URI | Contents |
|-----|----------|
| `component://<name>` | JSON metadata for a single component |
| `snippet://<prefix>` | JSON for a single snippet |

See [`docs/RESOURCES.md`](docs/RESOURCES.md).

## Development

This server lives in the same monorepo as `@sutekitechid/sicoco-v3-next`. To work on it locally:

```bash
# Install
cd mcp-server
npm install

# Regenerate the static registry (parses lib/ + snippets/)
npm run build:registry

# Run tests
npm test

# Build TypeScript
npm run build

# Smoke test the server (in another terminal)
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"0.1.0"}}}' \
  | node dist/src/index.js
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the design.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — design, data flow, why this approach
- [`docs/TOOLS.md`](docs/TOOLS.md) — every tool, with examples
- [`docs/RESOURCES.md`](docs/RESOURCES.md) — resource URI scheme
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — `ComponentMeta` and `SnippetMeta` types
- [`docs/CONSUMER_GUIDE.md`](docs/CONSUMER_GUIDE.md) — per-client setup walkthrough
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — how to add a new tool or parser
- [`docs/PUBLISHING.md`](docs/PUBLISHING.md) — release workflow to GitHub Packages

## License

Private — internal to `@sutekitechid`.
