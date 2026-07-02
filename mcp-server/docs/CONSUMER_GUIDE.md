# Consumer Guide

How to set up the `@sutekitechid/sicoco-v3-next-mcp` server in popular AI-assisted IDEs.

## Prerequisites

1. **GitHub token with `read:packages` scope.** Generate at <https://github.com/settings/tokens>.
2. **Node.js ≥ 18** on the machine that runs the MCP server (the editor's host, not a remote dev server).
3. **Network access** to `https://npm.pkg.github.com` (for the first `npx` call only — subsequent runs use the cache).

---

## 1. Configure npm to read from GitHub Packages

Add to your user-level `~/.npmrc`:

```
@sutekitechid:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxxxxxxx
```

Or, for project-local config (recommended when collaborating on a team), add to the project's `.npmrc` (which is committed to git):

```
@sutekitechid:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

…and store the token in each developer's shell env:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

---

## 2. Claude Code

Create `.mcp.json` in your project root (or `~/.claude/mcp.json` for global config):

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

Restart Claude Code. The tools should now appear in the available tool list (you can verify with `/mcp` in the Claude Code CLI).

### Verifying

In Claude Code, ask:

> "What tools do you have from the sicoco MCP server?"

The response should list `list_components`, `get_component`, etc.

---

## 3. Cursor

Create `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project-local):

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

Restart Cursor. Tools appear in the "Tools" panel.

---

## 4. VSCode with GitHub Copilot

Create `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "sicoco": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@sutekitechid/sicoco-v3-next-mcp"]
    }
  }
}
```

The exact key name (`mcpServers` vs `servers`) depends on your VSCode version. Refer to the [VSCode MCP docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for the current shape.

---

## 5. Verifying the connection

In your AI chat, ask:

> "List all Sicoco components in the 'form' category."

If the response is well-formed JSON listing e.g. `SInput`, `SDatePicker`, etc., everything is wired up.

---

## Troubleshooting

### "MCP server failed to start: 401 Unauthorized"

The GitHub Packages token is missing or invalid. Verify `~/.npmrc` and the `GITHUB_TOKEN` env var.

### "Module not found: @sutekitechid/sicoco-v3-next-mcp"

The package isn't on the public npm registry. Confirm `~/.npmrc` is being read by running `npm config get @sutekitechid:registry` — it should return `https://npm.pkg.github.com`.

### Tool returns "Component ... not found"

The component name in the AI's prompt is wrong. Use `list_components` first to see the canonical names.

### "Connection refused" / server never responds

Some firewalls block stdio transport. Try wrapping the call in a shell that resolves `npx`:

```json
{
  "mcpServers": {
    "sicoco": {
      "command": "sh",
      "args": ["-c", "npx -y @sutekitechid/sicoco-v3-next-mcp"]
    }
  }
}
```

### Server is slow on first call

`npx -y` downloads the package on first invocation. Subsequent calls are cached. You can pre-warm by running `npx -y @sutekitechid/sicoco-v3-next-mcp --version` once.

---

## Security notes

- The MCP server **only reads** — it never writes to your project or your filesystem.
- The server runs locally (stdio); it does not phone home.
- The bundled registry is static JSON shipped with the npm tarball; no dynamic code is executed.
- Your GitHub token is sent to `npm.pkg.github.com` only (HTTPS). It is not exposed to the AI assistant.
