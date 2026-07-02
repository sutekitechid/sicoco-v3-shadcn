# Publishing

This server is published to **GitHub Packages** as `@sutekitechid/sicoco-v3-next-mcp` (private, scoped to the `@sutekitechid` org).

## Versioning

We follow [Semantic Versioning](https://semver.org/).

- **0.x.y** — pre-1.0, API may break in minor versions.
- **1.0.0** — declared stable, breaking changes require major bump.
- Patch versions are for bug fixes and non-functional changes.
- Minor versions are for new tools, resources, or backwards-compatible additions.

## Pre-flight checklist

Before publishing a new version:

- [ ] `npm test` passes locally.
- [ ] `npm run build` produces `dist/` without TypeScript errors.
- [ ] `npm run build:registry` has been run and the JSON files are up-to-date.
- [ ] `CHANGELOG.md` has an entry for the new version.
- [ ] `docs/` is up-to-date with the new tool/resource/parser.
- [ ] A GitHub PAT with `write:packages` is available locally.

## Workflow

```bash
cd mcp-server

# 1. Bump version (choose one)
npm version patch   # 0.1.0 -> 0.1.1 (bug fixes)
npm version minor   # 0.1.0 -> 0.2.0 (new features)
npm version major   # 0.1.0 -> 1.0.0 (breaking changes)

# 2. Build (auto-runs prebuild -> registry, then tsc)
npm run build

# 3. Smoke-test the built artifact
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0.0.1"}}}' \
  | node dist/src/index.js

# 4. Publish to GitHub Packages
npm publish
# (publishConfig.registry in package.json sends it to https://npm.pkg.github.com)

# 5. Tag and push
git tag mcp-v$(node -p "require('./package.json').version")
git push --tags
```

## Rolling back a release

If a release introduces a regression:

1. **Mark the version as deprecated** in GitHub Packages UI (or via `npm deprecate`).
2. **Publish a patch** (`npm version patch`) that fixes the issue.
3. Update the consumer's pinned version.

`npm deprecate @sutekitechid/sicoco-v3-next-mcp@0.1.0 "Reverted due to..."`

## Verifying a release

After publishing, confirm the consumer-side install works:

```bash
mkdir /tmp/sicoco-smoke && cd /tmp/sicoco-smoke
echo '{"mcpServers":{"sicoco":{"command":"npx","args":["-y","@sutekitechid/sicoco-v3-next-mcp"]}}}' > .mcp.json
npx -y @sutekitechid/sicoco-v3-next-mcp --help 2>&1 || true
```

If the server boots and logs `Server ready: 68 components, 279 snippets`, the release is healthy.

## Security

- The published package contains only `dist/` (compiled JS) and `src/data/*.json` (registry).
- Source maps are included to aid debugging.
- No secrets, no telemetry, no network calls in the published artifact.
- CI uses an ephemeral GitHub PAT with `write:packages` scope; revoke after each release.
