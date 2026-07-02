# Changelog

All notable changes to `@sutekitechid/sicoco-v3-next-mcp` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-02

### Added

- Initial release.
- 8 MCP tools:
  - `list_components` (filter by category, optional sub-components)
  - `get_component` (full props / slots / emits / variants)
  - `search_components` (fuzzy)
  - `list_snippets` (filter by component)
  - `get_snippet` (by prefix)
  - `search_snippets` (fuzzy)
  - `generate_code` (use-case → best snippet)
  - `validate_usage` (light SFC check)
- 2 MCP resources: `component://<name>`, `snippet://<prefix>`.
- Build-time registry generator (`scripts/build-registry.ts`) that scans
  `lib/main.ts` and `lib/components/<name>/*.vue` + `index.ts` and emits
  static JSON consumed at runtime.
- vue-api-extractor with support for:
  - Inline type literals and referenced `interface` / `type` declarations
  - `withDefaults` wrappers
  - `interface X extends Y` (one level)
  - JSDoc descriptions on property signatures
  - Both `TSPropertySignature` and `TSCallSignatureDeclaration` emit shapes
- cva-extractor with support for unquoted and quoted variant keys, and
  primitive / string defaults.
- Vitest unit tests (41 tests across parsers, utils, and tool handlers).
- Documentation: README, ARCHITECTURE, TOOLS, RESOURCES, DATA_MODEL,
  CONSUMER_GUIDE, CONTRIBUTING, PUBLISHING.
- GitHub Packages publishing configuration.

## [0.2.0] - 2026-07-02

### Added

- **Utils support**: 4 new MCP tools for the library's utility functions:
  - `list_utils` (filter by category: merge/currency/file/pagination/sanitize)
  - `get_util` (full signature of one util)
  - `search_utils` (fuzzy)
  - `generate_util_code` (returns import + signature + call-template)
- New `util://<name>` MCP resource.
- New `UtilMeta` and `ParamMeta` types in `src/types.ts`.
- New `src/data/utils-catalog.ts` — hand-maintained metadata for the
  10 public utility functions re-exported from `lib/main.ts`.
- Build script now emits a third registry file `util-registry.json`
  alongside the existing component and snippet registries.

### Fixed

- **Snippet-to-component inference**: previously, snippet prefixes like
  `sidatepicker` failed to map to `SDatePicker` because a regex-based
  PascalCase converter didn't handle compound names. Replaced with a
  lookup-table approach in the new `src/parsers/snippet-inferrer.ts`.
  Now all 87 exported components are correctly linked to their snippets.
- **Direct `.vue` source paths**: components exported via
  `export { default as SAlert } from './components/alert/Alert.vue'`
  were being silently skipped during the build because the resolver
  only handled folder-style paths. The resolver now accepts both
  folder and direct-file sources.

### Changed

- Snippet inferrer extracted to its own module (`snippet-inferrer.ts`)
  with 9 dedicated unit tests.

### Test totals

- 58 unit tests pass (was 41 in 0.1.0).
