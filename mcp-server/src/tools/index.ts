import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { fuzzySearch } from '../utils/fuzzy-match.js'
import { componentToCategory } from '../data/categories.js'
import { validateSfc } from '../utils/sfc-validator.js'
import type { ComponentMeta, SnippetMeta, UtilMeta } from '../types.js'

export interface ToolDeps {
	components: Record<string, ComponentMeta>
	snippets: Record<string, SnippetMeta>
	utils: Record<string, UtilMeta>
}

export function registerTools(server: McpServer, deps: ToolDeps): void {
	registerListComponents(server, deps)
	registerGetComponent(server, deps)
	registerSearchComponents(server, deps)
	registerListSnippets(server, deps)
	registerGetSnippet(server, deps)
	registerSearchSnippets(server, deps)
	registerGenerateCode(server, deps)
	registerValidateUsage(server, deps)
	registerListUtils(server, deps)
	registerGetUtil(server, deps)
	registerSearchUtils(server, deps)
	registerGenerateUtilCode(server, deps)
}

function ok(text: string) {
	return { content: [{ type: 'text' as const, text }] }
}

function registerListComponents(server: McpServer, deps: ToolDeps) {
	server.tool(
		'list_components',
		'List all Sicoco components, optionally filtered by category.',
		{
			category: z
				.enum(['form', 'feedback', 'layout', 'data', 'overlay', 'typography', 'utility'])
				.optional()
				.describe('Filter by top-level category.'),
			includeSubComponents: z
				.boolean()
				.optional()
				.default(false)
				.describe('Include sub-components (e.g. SCardHeader).'),
		},
		async ({ category, includeSubComponents }) => {
			const all = Object.values(deps.components)
			const filtered = all.filter((c) => {
				if (category && c.category !== category) return false
				if (!includeSubComponents && c.isSubComponent) return false
				return true
			})
			const grouped: Record<string, ComponentMeta[]> = {}
			for (const c of filtered) {
				const key = c.category
				if (!grouped[key]) grouped[key] = []
				grouped[key].push(c)
			}
			return ok(JSON.stringify({ count: filtered.length, grouped }, null, 2))
		},
	)
}

function registerGetComponent(server: McpServer, deps: ToolDeps) {
	server.tool(
		'get_component',
		'Get the full API specification of a single component (props, slots, emits, variants).',
		{
			name: z
				.string()
				.describe('Component name (e.g. "SDatePicker"). Case-sensitive.'),
		},
		async ({ name }) => {
			const component = deps.components[name]
			if (!component) {
				return ok(JSON.stringify({ error: `Component "${name}" not found.`, availableSample: Object.keys(deps.components).slice(0, 10) }, null, 2))
			}
			return ok(JSON.stringify(component, null, 2))
		},
	)
}

function registerSearchComponents(server: McpServer, deps: ToolDeps) {
	server.tool(
		'search_components',
		'Fuzzy search components by name, description, or prop keyword.',
		{
			query: z.string().describe('Search query (e.g. "date picker", "calendar").'),
			limit: z.number().int().min(1).max(50).optional().default(10),
		},
		async ({ query, limit }) => {
			const items = Object.values(deps.components).filter((c) => !c.isSubComponent)
			const results = fuzzySearch(items, query, (c) =>
				`${c.name} ${c.description} ${c.props.map((p) => p.name).join(' ')}`,
			).slice(0, limit)
			return ok(
				JSON.stringify(
					{
						query,
						count: results.length,
						results: results.map((r) => ({
							score: Math.round(r.score * 100) / 100,
							component: {
								name: r.item.name,
								category: r.item.category,
								description: r.item.description,
							},
						})),
					},
					null,
					2,
				),
			)
		},
	)
}

function registerListSnippets(server: McpServer, deps: ToolDeps) {
	server.tool(
		'list_snippets',
		'List all Sicoco snippets, optionally filtered by component.',
		{
			component: z
				.string()
				.optional()
				.describe('Filter by component name (e.g. "SButton").'),
		},
		async ({ component }) => {
			let snippets = Object.values(deps.snippets)
			if (component) snippets = snippets.filter((s) => s.component === component)
			snippets.sort((a, b) => a.prefix.localeCompare(b.prefix))
			return ok(
				JSON.stringify(
					{
						count: snippets.length,
						snippets: snippets.map((s) => ({
							prefix: s.prefix,
							name: s.name,
							description: s.description,
							component: s.component,
						})),
					},
					null,
					2,
				),
			)
		},
	)
}

function registerGetSnippet(server: McpServer, deps: ToolDeps) {
	server.tool(
		'get_snippet',
		'Retrieve the body of a single snippet by prefix.',
		{
			prefix: z.string().describe('Snippet prefix (e.g. "sibutton:primary").'),
		},
		async ({ prefix }) => {
			const snippet = deps.snippets[prefix]
			if (!snippet) {
				const similar = Object.keys(deps.snippets)
					.filter((p) => p.startsWith(prefix.split(':')[0] ?? ''))
					.slice(0, 5)
				return ok(
					JSON.stringify({ error: `Snippet "${prefix}" not found.`, similar }, null, 2),
				)
			}
			return ok(JSON.stringify(snippet, null, 2))
		},
	)
}

function registerSearchSnippets(server: McpServer, deps: ToolDeps) {
	server.tool(
		'search_snippets',
		'Fuzzy search snippets by prefix, name, description, or component.',
		{
			query: z.string().describe('Search query (e.g. "with validation", "primary").'),
			component: z.string().optional().describe('Restrict to a single component.'),
			limit: z.number().int().min(1).max(50).optional().default(15),
		},
		async ({ query, component, limit }) => {
			let items = Object.values(deps.snippets)
			if (component) items = items.filter((s) => s.component === component)
			const results = fuzzySearch(
				items,
				query,
				(s) => `${s.prefix} ${s.name} ${s.description} ${s.component ?? ''}`,
			).slice(0, limit)
			return ok(
				JSON.stringify(
					{
						query,
						count: results.length,
						results: results.map((r) => ({
							score: Math.round(r.score * 100) / 100,
							snippet: {
								prefix: r.item.prefix,
								name: r.item.name,
								description: r.item.description,
								component: r.item.component,
							},
						})),
					},
					null,
					2,
				),
			)
		},
	)
}

function registerGenerateCode(server: McpServer, deps: ToolDeps) {
	server.tool(
		'generate_code',
		'Generate ready-to-paste Vue code for a use-case by picking the best matching snippet and augmenting it with bind values.',
		{
			component: z.string().describe('Component name (e.g. "SDatePicker").'),
			useCase: z
				.string()
				.optional()
				.describe('Use-case description (e.g. "with required validation and locale id-ID").'),
		},
		async ({ component, useCase }) => {
			const snippets = Object.values(deps.snippets).filter(
				(s) => s.component === component,
			)
			if (snippets.length === 0) {
				return ok(
					JSON.stringify(
						{
							error: `No snippets found for component "${component}".`,
							availableComponents: Array.from(
								new Set(Object.values(deps.snippets).map((s) => s.component).filter(Boolean)),
							).slice(0, 20),
						},
						null,
						2,
					),
				)
			}
			let chosen = snippets[0]
			if (useCase) {
				const ranked = fuzzySearch(snippets, useCase, (s) => `${s.prefix} ${s.description}`)
				chosen = ranked[0]?.item ?? snippets[0]
			}
			const componentMeta = deps.components[component]
			const importLine = componentMeta
				? `import { ${component} } from '${componentMeta.importPath}'`
				: `import { ${component} } from '@sutekitechid/sicoco-v3-next'`
			return ok(
				JSON.stringify(
					{
						import: importLine,
						chosenSnippet: {
							prefix: chosen?.prefix,
							name: chosen?.name,
							description: chosen?.description,
						},
						code: chosen?.body,
						note: 'Replace $1, $2, ... placeholders with your actual values.',
					},
					null,
					2,
				),
			)
		},
	)
}

function registerValidateUsage(server: McpServer, deps: ToolDeps) {
	server.tool(
		'validate_usage',
		'Validate a Vue SFC string. Checks Sicoco component tag names, prop names, and required props.',
		{
			code: z.string().describe('The Vue SFC source code to validate.'),
		},
		async ({ code }) => {
			const componentSpecs: Record<
				string,
				{ name: string; props: Array<{ name: string; type: string; required: boolean }> }
			> = {}
			for (const c of Object.values(deps.components)) {
				componentSpecs[c.name] = {
					name: c.name,
					props: c.props.map((p) => ({ name: p.name, type: p.type, required: p.required })),
				}
			}
			const issues = validateSfc(code, { components: componentSpecs })
			return ok(
				JSON.stringify(
					{
						issueCount: issues.length,
						issues,
						verdict: issues.some((i) => i.severity === 'error') ? 'invalid' : 'ok',
					},
					null,
					2,
				),
			)
		},
	)
}

// ----------------------------------------------------------------
// Utility tools
// ----------------------------------------------------------------

function registerListUtils(server: McpServer, deps: ToolDeps) {
	server.tool(
		'list_utils',
		'List all Sicoco utility functions, optionally filtered by category.',
		{
			category: z
				.enum(['merge', 'currency', 'file', 'pagination', 'sanitize'])
				.optional()
				.describe('Filter by util category.'),
		},
		async ({ category }) => {
			const all = Object.values(deps.utils)
			const filtered = category ? all.filter((u) => u.category === category) : all
			const grouped: Record<string, UtilMeta[]> = {}
			for (const u of filtered) {
				if (!grouped[u.category]) grouped[u.category] = []
				grouped[u.category]!.push(u)
			}
			return ok(
				JSON.stringify(
					{ count: filtered.length, grouped },
					null,
					2,
				),
			)
		},
	)
}

function registerGetUtil(server: McpServer, deps: ToolDeps) {
	server.tool(
		'get_util',
		'Get the full signature and description of a single utility function.',
		{
			name: z
				.string()
				.describe('Util function name (e.g. "formatCurrency", "cn").'),
		},
		async ({ name }) => {
			const util = deps.utils[name]
			if (!util) {
				return ok(
					JSON.stringify(
						{
							error: `Util "${name}" not found.`,
							availableUtils: Object.keys(deps.utils),
						},
						null,
						2,
					),
				)
			}
			return ok(JSON.stringify(util, null, 2))
		},
	)
}

function registerSearchUtils(server: McpServer, deps: ToolDeps) {
	server.tool(
		'search_utils',
		'Fuzzy search utility functions by name, description, or parameter.',
		{
			query: z.string().describe('Search query (e.g. "currency", "file size").'),
			limit: z.number().int().min(1).max(50).optional().default(10),
		},
		async ({ query, limit }) => {
			const results = fuzzySearch(
				Object.values(deps.utils),
				query,
				(u) =>
					`${u.name} ${u.description} ${u.category} ${u.parameters.map((p) => p.name).join(' ')}`,
			).slice(0, limit)
			return ok(
				JSON.stringify(
					{
						query,
						count: results.length,
						results: results.map((r) => ({
							score: Math.round(r.score * 100) / 100,
							util: {
								name: r.item.name,
								category: r.item.category,
								description: r.item.description,
							},
						})),
					},
					null,
					2,
				),
			)
		},
	)
}

function registerGenerateUtilCode(server: McpServer, deps: ToolDeps) {
	server.tool(
		'generate_util_code',
		'Generate a call expression for a utility function, with sample argument placeholders.',
		{
			name: z.string().describe('Util function name (e.g. "formatCurrency").'),
		},
		async ({ name }) => {
			const util = deps.utils[name]
			if (!util) {
				return ok(
					JSON.stringify(
						{
							error: `Util "${name}" not found.`,
							availableUtils: Object.keys(deps.utils),
						},
						null,
						2,
					),
				)
			}
			// Build a call expression with placeholders for each parameter.
			const argList = util.parameters
				.map((p, i) => {
					if (!p.required) return `${p.name}: ${placeholderForType(p.type)}`
					return `/* ${p.name}: ${p.type} */ $${i + 1}`
				})
				.join(', ')

			const signaturePreview = util.parameters
				.map((p) => `${p.name}${p.required ? '' : '?'}: ${p.type}`)
				.join(', ')

			return ok(
				JSON.stringify(
					{
						import: `import { ${util.name} } from '${util.importPath}'`,
						signature: `${util.name}(${signaturePreview}): ${util.returnType}`,
						code: `${util.name}(${argList})`,
						note: 'Replace the placeholders ($1, $2, ...) with actual values.',
						relatedSnippets: util.relatedSnippets,
					},
					null,
					2,
				),
			)
		},
	)
}

function placeholderForType(type: string): string {
	const t = type.toLowerCase()
	if (t.includes('string')) return `'sample'`
	if (t.includes('number')) return '0'
	if (t.includes('boolean')) return 'false'
	if (t.includes('[]') || t.startsWith('array')) return '[]'
	if (t.includes('=>') || t.includes('()')) return '() => {}'
	return '/* value */'
}
