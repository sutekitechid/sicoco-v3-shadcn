import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import type { ComponentMeta, SnippetMeta, UtilMeta } from '../types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Resolve the path to a bundled registry file.
 *
 * After `tsc` the file lives in `dist/src/data/...`. When running from
 * source via `tsx`, the file lives in `src/data/...`. We try both
 * relative to the current module so the same code works in dev, build,
 * and in the published npm tarball.
 */
function resolveRegistryPath(
	name: 'component-registry.json' | 'snippet-registry.json' | 'util-registry.json',
): string {
	const candidates = [
		// tsx dev / build output
		join(__dirname, name),
		// published package: registries sit in src/data
		join(__dirname, '..', 'src', 'data', name),
		join(__dirname, '..', '..', 'src', 'data', name),
		join(__dirname, '..', '..', '..', 'src', 'data', name),
	]
	for (const candidate of candidates) {
		if (existsSync(candidate)) return candidate
	}
	throw new Error(
		`Could not find ${name}. Tried: ${candidates.map((c) => resolve(c)).join(', ')}`,
	)
}

/**
 * Load the bundled component registry from disk.
 *
 * The registry is generated at build time by `scripts/build-registry.ts`
 * and shipped with the npm package. It is read once at server startup.
 */
export function loadComponentRegistry(): Record<string, ComponentMeta> {
	const path = resolveRegistryPath('component-registry.json')
	const raw = readFileSync(path, 'utf8')
	const parsed = JSON.parse(raw) as { components: Record<string, ComponentMeta> }
	return parsed.components ?? {}
}

/**
 * Load the bundled snippet registry from disk.
 */
export function loadSnippetRegistry(): Record<string, SnippetMeta> {
	const path = resolveRegistryPath('snippet-registry.json')
	const raw = readFileSync(path, 'utf8')
	const parsed = JSON.parse(raw) as { snippets: Record<string, SnippetMeta> }
	return parsed.snippets ?? {}
}

/**
 * Load the bundled util registry from disk.
 */
export function loadUtilRegistry(): Record<string, UtilMeta> {
	const path = resolveRegistryPath('util-registry.json')
	const raw = readFileSync(path, 'utf8')
	const parsed = JSON.parse(raw) as { utils: Record<string, UtilMeta> }
	return parsed.utils ?? {}
}
