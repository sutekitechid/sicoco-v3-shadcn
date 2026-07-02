/**
 * Build script: scan the parent repo (lib/main.ts + lib/components/ +
 * snippets/) and emit two static JSON registries used by the runtime
 * MCP server.
 *
 * Usage: `tsx scripts/build-registry.ts [repo-root]`
 *   - `repo-root` defaults to the parent of the mcp-server/ folder.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractCvaVariants } from '../src/parsers/cva-extractor.js'
import { extractVueApi } from '../src/parsers/vue-api-extractor.js'
import { buildComponentLookup, inferComponentFromPrefix } from '../src/parsers/snippet-inferrer.js'
import { componentToCategory } from '../src/data/categories.js'
import { utilCatalog } from '../src/data/utils-catalog.js'
import type {
	ComponentMeta,
	ComponentRegistry,
	SnippetMeta,
	SnippetRegistry,
	UtilMeta,
	UtilRegistry,
	VariantMeta,
} from '../src/types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MCP_ROOT = resolve(__dirname, '..')
const DEFAULT_REPO_ROOT = resolve(MCP_ROOT, '..')

interface SnippetFile {
	[key: string]:
		| {
				prefix: string
				body: string[]
				description?: string
		  }
		| undefined
}

function main() {
	const repoRoot = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_REPO_ROOT
	if (!existsSync(join(repoRoot, 'lib', 'main.ts'))) {
		console.error(
			`[build-registry] Could not find lib/main.ts under ${repoRoot}. Pass the repo root as the first argument.`,
		)
		process.exit(1)
	}

	const libDir = join(repoRoot, 'lib')

	console.log(`[build-registry] Scanning repo at ${repoRoot}`)

	const exports = parseExports(readFileSync(join(repoRoot, 'lib/main.ts'), 'utf8'))
	console.log(`[build-registry] Found ${exports.size} exports`)

	const components = buildComponentRegistry(repoRoot, libDir, exports)
	const snippets = buildSnippetRegistry(repoRoot, exports, components)

	const componentRegistry: ComponentRegistry = {
		version: 1,
		libraryVersion: readPackageVersion(repoRoot),
		generatedAt: new Date().toISOString(),
		components,
	}
	const snippetRegistry: SnippetRegistry = {
		version: 1,
		libraryVersion: componentRegistry.libraryVersion,
		generatedAt: componentRegistry.generatedAt,
		snippets,
	}
	const utilRegistry: UtilRegistry = {
		version: 1,
		libraryVersion: componentRegistry.libraryVersion,
		generatedAt: componentRegistry.generatedAt,
		utils: buildUtilRegistry(snippets),
	}

	const dataDir = join(MCP_ROOT, 'src', 'data')
	if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })
	writeFileSync(
		join(dataDir, 'component-registry.json'),
		JSON.stringify(componentRegistry, null, 2),
		'utf8',
	)
	writeFileSync(
		join(dataDir, 'snippet-registry.json'),
		JSON.stringify(snippetRegistry, null, 2),
		'utf8',
	)
	writeFileSync(
		join(dataDir, 'util-registry.json'),
		JSON.stringify(utilRegistry, null, 2),
		'utf8',
	)

	console.log(
		`[build-registry] Wrote ${Object.keys(components).length} components, ${Object.keys(snippets).length} snippets, and ${Object.keys(utilRegistry.utils).length} utils to ${dataDir}`,
	)
}

/**
 * Build the util registry by cross-referencing the hand-maintained
 * catalog with the snippet registry. Each util's `relatedSnippets`
 * is filled with snippet prefixes that mention the util name in
 * their body.
 */
function buildUtilRegistry(
	snippets: Record<string, SnippetMeta>,
): Record<string, UtilMeta> {
	const out: Record<string, UtilMeta> = {}
	for (const u of utilCatalog) {
		// Find any snippets whose body invokes this util.
		const related: string[] = []
		for (const [prefix, s] of Object.entries(snippets)) {
			if (s.body.includes(`${u.name}(`)) related.push(prefix)
		}
		// Hand-curated snippets take priority; merge with body-matched.
		const merged = Array.from(new Set([...u.relatedSnippets, ...related]))
		out[u.name] = { ...u, relatedSnippets: merged }
	}
	return out
}

function parseExports(mainTs: string): Map<string, { source: string; isDefault: boolean }> {
	const exports = new Map<string, { source: string; isDefault: boolean }>()

	// Strip comments to avoid matching commented-out exports.
	const cleaned = mainTs
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/^\s*\/\/.*$/gm, '')

	// Match: export { ... } from '...' (possibly multi-line).
	const re = /export\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]/g
	let m: RegExpExecArray | null
	while ((m = re.exec(cleaned)) !== null) {
		const list = m[1] ?? ''
		const source = m[2] ?? ''
		for (const part of list.split(',')) {
			const trimmed = part.trim()
			if (!trimmed) continue
			const asMatch = /(\w+)\s+as\s+(\w+)/.exec(trimmed)
			if (asMatch) {
				exports.set(asMatch[2] ?? '', { source, isDefault: false })
				continue
			}
			const defaultMatch = /^default\s+as\s+(\w+)$/.exec(trimmed)
			if (defaultMatch) {
				exports.set(defaultMatch[1] ?? '', { source, isDefault: true })
				continue
			}
			exports.set(trimmed, { source, isDefault: false })
		}
	}

	// Match: export * from '...' (untracked, but recorded for diagnostic).
	// No action: wildcard re-exports cannot be resolved statically.

	return exports
}

function resolveSourceFile(
	repoRoot: string,
	libDir: string,
	source: string,
): { vuePath: string; indexPath: string | null } | null {
	// source is relative to lib/ (e.g. './components/button' or
	// './components/alert/Alert.vue').
	const rel = source.replace(/^\.\//, '')
	const abs = join(libDir, rel)

	// Path already has a known extension? Use it directly.
	if (existsSync(abs)) {
		if (abs.endsWith('.vue')) return { vuePath: abs, indexPath: null }
		if (abs.endsWith('.ts') || abs.endsWith('.js')) {
			return { vuePath: abs, indexPath: abs }
		}
	}

	// Try appending an extension (covers "./components/button" -> Button.vue).
	for (const ext of ['.vue', '.ts', '.js']) {
		const direct = `${abs}${ext}`
		if (existsSync(direct)) {
			return { vuePath: direct, indexPath: null }
		}
	}

	// Folder with index.ts. Find a .vue file alongside.
	for (const ext of ['.ts', '.js']) {
		const indexFile = `${abs}/index${ext}`
		if (existsSync(indexFile)) {
			const indexSrc = readFileSync(indexFile, 'utf8')
			// Try to find a .vue file re-exported via "from './Foo.vue'".
			const fromRe = /from\s*['"]([^'"]+\.vue)['"]/g
			let m: RegExpExecArray | null
			while ((m = fromRe.exec(indexSrc)) !== null) {
				const relVue = m[1] ?? ''
				const vueAbs = resolve(dirname(indexFile), relVue)
				if (existsSync(vueAbs)) {
					return { vuePath: vueAbs, indexPath: indexFile }
				}
			}
			// Fallback: look for the first *.vue in the folder.
			try {
				const dir = dirname(indexFile)
				for (const f of readdirSync(dir)) {
					if (f.endsWith('.vue')) {
						return { vuePath: join(dir, f), indexPath: indexFile }
					}
				}
			} catch {
				// ignore
			}
			// No .vue; the index.ts itself is the source.
			return { vuePath: indexFile, indexPath: indexFile }
		}
	}
	void repoRoot
	return null
}

function buildComponentRegistry(
	repoRoot: string,
	libDir: string,
	exports: Map<string, { source: string; isDefault: boolean }>,
): Record<string, ComponentMeta> {
	const components: Record<string, ComponentMeta> = {}
	const subNames = new Set<string>()

	// First pass: collect sub-component names.
	for (const [name] of exports) {
		// Heuristic: components that share a common prefix with a primary
		// component are sub-components. E.g. SCardHeader, SCardContent, ...
		for (const other of exports.keys()) {
			if (other === name) continue
			if (name.startsWith(other) && name.length > other.length) {
				// Only mark as sub if the suffix starts with uppercase.
				const rest = name.slice(other.length)
				if (/^[A-Z]/.test(rest)) {
					subNames.add(name)
					break
				}
			}
		}
	}

	// Second pass: read each component's source.
	for (const [name, info] of exports) {
		const resolved = resolveSourceFile(repoRoot, libDir, info.source)
		if (!resolved) continue

		let source: string
		if (resolved.vuePath.endsWith('.vue')) {
			source = readFileSync(resolved.vuePath, 'utf8')
		} else if (resolved.indexPath) {
			// For default-export sub-components, the .vue file is
			// referenced from index.ts. We need to find the .vue file
			// to extract its API.
			const idxSrc = readFileSync(resolved.indexPath, 'utf8')
			const defaultFromRe = /export\s*\{\s*default\s+as\s+\w+\s*\}\s*from\s*['"]([^'"]+)['"]/
			const directFromRe = /from\s*['"]([^'"]+\.vue)['"]/
			const reexportedVue =
				directFromRe.exec(idxSrc)?.[1] ?? defaultFromRe.exec(idxSrc)?.[1]
			if (!reexportedVue) continue
			const vueAbs = join(dirname(resolved.indexPath), reexportedVue)
			if (!existsSync(vueAbs)) continue
			source = readFileSync(vueAbs, 'utf8')
		} else {
			continue
		}

		const { props, emits, slots } = extractVueApi(source)
		const description = extractVueDescription(source)

		// Try to load cva variants from the same folder's index.ts.
		const variants: VariantMeta[] = []
		const folderAbs = dirname(resolved.vuePath)
		const possibleIndexFiles = ['index.ts', 'index.js']
		for (const f of possibleIndexFiles) {
			const p = join(folderAbs, f)
			if (existsSync(p) && p !== resolved.vuePath) {
				const idxSrc = readFileSync(p, 'utf8')
				variants.push(...extractCvaVariants(idxSrc))
				break
			}
		}

		const category = componentToCategory.get(name) ?? 'utility'
		const sourcePath = resolved.vuePath
			.replace(`${repoRoot}/`, '')

		components[name] = {
			name,
			importPath: '@sutekitechid/sicoco-v3-next',
			sourcePath,
			category,
			description,
			props,
			emits,
			slots,
			variants,
			relatedSnippets: [],
			isSubComponent: subNames.has(name),
			parent: subNames.has(name) ? inferParent(name, subNames) : undefined,
		}
	}

	// Backfill relatedSnippets per component.
	// (Done after snippet registry is built — see backfillSnippets.)

	return components
}

function inferParent(name: string, subNames: Set<string>): string | undefined {
	let best: string | undefined
	for (const other of subNames) {
		if (other === name) continue
		if (name.startsWith(other)) {
			if (!best || other.length > best.length) best = other
		}
	}
	return best
}

function extractVueDescription(source: string): string {
	const commentBlockRe = /<!--([\s\S]*?)-->/
	const comment = commentBlockRe.exec(source)?.[1] ?? ''
	const jsdoc = /\/\*\*([\s\S]*?)\*\//.exec(source)
	const block = jsdoc ? jsdoc[1] : comment
	if (!block) return ''
	return block
		.split('\n')
		.map((line) => line.replace(/^\s*\*?\s?/, '').trim())
		.filter((line) => line.length > 0 && !line.startsWith('@'))
		.join(' ')
}

function buildSnippetRegistry(
	repoRoot: string,
	_exports: Map<string, { source: string; isDefault: boolean }>,
	components: Record<string, ComponentMeta>,
): Record<string, SnippetMeta> {
	const snippets: Record<string, SnippetMeta> = {}
	const snippetsDir = join(repoRoot, 'snippets')
	if (!existsSync(snippetsDir)) return snippets

	const lookup = buildComponentLookup(Object.keys(components))

	for (const file of readdirSync(snippetsDir).sort()) {
		if (!file.endsWith('.json')) continue
		const filePath = join(snippetsDir, file)
		const raw = readFileSync(filePath, 'utf8')
		let parsed: SnippetFile
		try {
			parsed = JSON.parse(raw) as SnippetFile
		} catch (err) {
			console.warn(`[build-registry] Skipping ${file}: ${(err as Error).message}`)
			continue
		}

		for (const [name, def] of Object.entries(parsed)) {
			if (!def) continue
			const component = inferComponentFromPrefix(def.prefix, lookup)
			const body = (def.body ?? []).join('\n')
			snippets[def.prefix] = {
				prefix: def.prefix,
				name,
				description: def.description ?? '',
				body,
				component,
				category: inferSnippetCategory(def.prefix),
			}
			if (component && components[component]) {
				components[component]!.relatedSnippets.push(def.prefix)
			}
		}
	}
	return snippets
}

function inferSnippetCategory(prefix: string): string {
	if (prefix.startsWith('si-format') || prefix.startsWith('si-file') || prefix.startsWith('si-cn') || prefix.startsWith('si-totalpages') || prefix.startsWith('si-infinite')) {
		return 'utility'
	}
	return 'component'
}

function readPackageVersion(repoRoot: string): string {
	try {
		const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')) as {
			version?: string
		}
		return pkg.version ?? '0.0.0'
	} catch {
		return '0.0.0'
	}
}

main()
