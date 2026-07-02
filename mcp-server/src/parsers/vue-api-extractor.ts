import { parse as parseTs } from '@typescript-eslint/parser'
import type { EmitMeta, PropMeta, SlotMeta } from '../types.js'

/**
 * Extract the public API (props, emits, slots) of a Vue SFC.
 *
 * The SFC is split into its `<script setup>...</script>` block (if any),
 * then the block is parsed with the TypeScript ESLint parser so that
 * generic type arguments and local type references resolve correctly.
 */

interface RangePair {
	start: number
	end: number
}

const DEFAULT_PROP_TYPE = 'unknown'

/**
 * Parse a Vue SFC source string and return its public API.
 */
export function extractVueApi(source: string): {
	props: PropMeta[]
	emits: EmitMeta[]
	slots: SlotMeta[]
} {
	const result = { props: [] as PropMeta[], emits: [] as EmitMeta[], slots: [] as SlotMeta[] }

	const scriptBlock = extractScriptSetup(source)
	if (!scriptBlock) return result

	let tsAst
	try {
		tsAst = parseTs(scriptBlock.text, {
			sourceType: 'module',
			ecmaVersion: 2022,
			comment: true,
			loc: true,
			range: true,
		})
	} catch {
		return result
	}

	const typeAliases = collectTypeAliases(tsAst, scriptBlock.text)
	const comments = (tsAst as { comments?: Array<{ value: string; range: [number, number] }> }).comments ?? []

	for (const stmt of tsAst.body) {
		// We accept both `defineProps<T>()` (ExpressionStatement) and
		// `const x = defineProps<T>()` (VariableDeclaration) forms.
		const callExpressions: unknown[] = []
		if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'CallExpression') {
			callExpressions.push(stmt.expression)
		} else if (stmt.type === 'VariableDeclaration') {
			for (const d of stmt.declarations) {
				const init = d.init
				if (init?.type === 'CallExpression') callExpressions.push(init)
			}
		}
		for (const expr of callExpressions) {
			const calleeName = getCalleeName((expr as { callee: unknown }).callee)
			if (!calleeName) continue

			if (calleeName === 'defineProps') {
				result.props = parseDefineProps(expr, scriptBlock.text, typeAliases, comments)
			} else if (calleeName === 'defineEmits') {
				result.emits = parseDefineEmits(expr, scriptBlock.text, typeAliases, comments)
			} else if (calleeName === 'defineSlots') {
				result.slots = parseDefineSlots(expr, scriptBlock.text, typeAliases, comments)
			} else if (calleeName === 'withDefaults') {
				const outer = expr as { arguments?: unknown[] }
				const inner = outer.arguments?.[0]
				if (inner && (inner as { type: string }).type === 'CallExpression') {
					const innerCall = inner as { callee: unknown }
					const innerCallee = getCalleeName(innerCall.callee)
					if (innerCallee === 'defineProps') {
						result.props = parseDefineProps(inner, scriptBlock.text, typeAliases, comments)
						// Apply defaults from withDefaults' second arg.
						const defaultsArg = outer.arguments?.[1]
						if (
							defaultsArg &&
							(defaultsArg as { type: string }).type === 'ObjectExpression'
						) {
							const defaults = extractObjectDefaults(
								defaultsArg as { properties?: unknown[] },
								scriptBlock.text,
							)
							for (const prop of result.props) {
								if (defaults.has(prop.name)) {
									prop.default = defaults.get(prop.name)
								}
							}
						}
					}
				}
			}
		}
	}

	return result
}

function extractScriptSetup(source: string): { text: string } | null {
	// Match <script ... setup ...> (allowing multi-line attributes).
	const openRe = /<script\b([^>]*)\bsetup\b([^>]*)>/i
	const openMatch = openRe.exec(source)
	if (!openMatch) return null
	const openEnd = openMatch.index + openMatch[0].length

	// Find the matching </script> after the opening tag.
	const closeRe = /<\/script\s*>/i
	closeRe.lastIndex = openEnd
	const closeMatch = closeRe.exec(source)
	if (!closeMatch) return null

	return { text: source.slice(openEnd, closeMatch.index) }
}

function getCalleeName(callee: unknown): string | null {
	const c = callee as { type?: string; name?: string; object?: unknown; property?: unknown }
	if (c.type === 'Identifier' && typeof c.name === 'string') return c.name
	if (c.type === 'MemberExpression') {
		const obj = c.object as { name?: string }
		const prop = c.property as { name?: string }
		if (obj?.name && prop?.name) return `${obj.name}.${prop.name}`
	}
	return null
}

function parseDefineProps(
	callExpr: unknown,
	source: string,
	typeAliases: Map<string, unknown>,
	comments: Array<{ value: string; range: [number, number] }>,
): PropMeta[] {
	const call = callExpr as { typeArguments?: { params?: unknown[] }; typeParameters?: { params?: unknown[] } }
	const props: PropMeta[] = []

	const typeArgs = call.typeArguments?.params ?? call.typeParameters?.params
	if (!typeArgs || typeArgs.length === 0) return props

	const typeArg = typeArgs[0] as { type: string; members?: unknown[] }
	if (typeArg.type === 'TSTypeLiteral') {
		appendPropsFromTypeLiteral(typeArg, source, props, comments)
		return props
	}
	if (typeArg.type === 'TSTypeReference') {
		const literal = resolveToTypeLiteral(typeArg, typeAliases)
		if (literal) appendPropsFromTypeLiteral(literal, source, props, comments)
		return props
	}

	return props
}

function parseDefineEmits(
	callExpr: unknown,
	source: string,
	typeAliases: Map<string, unknown>,
	comments: Array<{ value: string; range: [number, number] }>,
): EmitMeta[] {
	const call = callExpr as { typeArguments?: { params?: unknown[] }; typeParameters?: { params?: unknown[] } }
	const emits: EmitMeta[] = []
	const typeArgs = call.typeArguments?.params ?? call.typeParameters?.params
	if (!typeArgs || typeArgs.length === 0) return emits

	const typeArg = typeArgs[0] as { type: string; members?: unknown[] }
	if (typeArg.type === 'TSTypeLiteral') {
		appendEmitsFromTypeLiteral(typeArg, source, emits, comments)
		return emits
	}
	if (typeArg.type === 'TSTypeReference') {
		const literal = resolveToTypeLiteral(typeArg, typeAliases)
		if (literal) appendEmitsFromTypeLiteral(literal, source, emits, comments)
	}
	return emits
}

function parseDefineSlots(
	callExpr: unknown,
	source: string,
	typeAliases: Map<string, unknown>,
	comments: Array<{ value: string; range: [number, number] }>,
): SlotMeta[] {
	const call = callExpr as { typeArguments?: { params?: unknown[] }; typeParameters?: { params?: unknown[] } }
	const slots: SlotMeta[] = []
	const typeArgs = call.typeArguments?.params ?? call.typeParameters?.params
	if (!typeArgs || typeArgs.length === 0) return slots

	const typeArg = typeArgs[0] as { type: string; members?: unknown[] }
	if (typeArg.type === 'TSTypeLiteral') {
		appendSlotsFromTypeLiteral(typeArg, source, slots, comments)
		return slots
	}
	if (typeArg.type === 'TSTypeReference') {
		const literal = resolveToTypeLiteral(typeArg, typeAliases)
		if (literal) appendSlotsFromTypeLiteral(literal, source, slots, comments)
	}
	return slots
}

function appendPropsFromTypeLiteral(
	typeLiteral: { members?: unknown[] },
	source: string,
	out: PropMeta[],
	comments: Array<{ value: string; range: [number, number] }>,
): void {
	for (const member of typeLiteral.members ?? []) {
		const m = member as {
			type: string
			key?: { name?: string }
			typeAnnotation?: unknown
			optional?: boolean
			range?: [number, number]
		}
		if (m.type !== 'TSPropertySignature') continue
		const name = m.key?.name
		if (!name) continue
		out.push({
			name,
			type: typeToString(m.typeAnnotation, source),
			required: !m.optional,
			description: m.range ? findPrecedingComment(comments, m.range[0]) : undefined,
		})
	}
}

function appendEmitsFromTypeLiteral(
	typeLiteral: { members?: unknown[] },
	source: string,
	out: EmitMeta[],
	comments: Array<{ value: string; range: [number, number] }>,
): void {
	for (const member of typeLiteral.members ?? []) {
		const m = member as {
			type: string
			key?: { name?: string }
			parameters?: Array<{ typeAnnotation?: unknown }>
			typeAnnotation?: unknown
			range?: [number, number]
		}
		const desc = m.range ? findPrecedingComment(comments, m.range[0]) : undefined
		// Property-style: { update: (value: T) => void }
		if (m.type === 'TSPropertySignature') {
			const name = m.key?.name
			if (!name) continue
			out.push({
				name,
				payload: typeToString(m.typeAnnotation, source),
				description: desc,
			})
			continue
		}
		// Call-signature style: (e: 'update', value: T): void
		if (m.type === 'TSCallSignatureDeclaration') {
			const firstParam = m.parameters?.[0]
			if (!firstParam) continue
			// The first param's type annotation is the event name literal.
			const firstParamType = typeToString(firstParam.typeAnnotation, source)
			const literal = /'([^']+)'|"([^"]+)"/.exec(firstParamType)
			const name = literal?.[1] ?? literal?.[2] ?? firstParamType
			const remainingParams = (m.parameters ?? []).slice(1)
			const payload = remainingParams
				.map((p) => typeToString(p.typeAnnotation, source))
				.join(', ')
			out.push({
				name,
				payload: payload || undefined,
				description: desc,
			})
		}
	}
}

function appendSlotsFromTypeLiteral(
	typeLiteral: { members?: unknown[] },
	source: string,
	out: SlotMeta[],
	comments: Array<{ value: string; range: [number, number] }>,
): void {
	for (const member of typeLiteral.members ?? []) {
		const m = member as {
			type: string
			key?: { name?: string }
			typeAnnotation?: unknown
			range?: [number, number]
		}
		if (m.type !== 'TSPropertySignature') continue
		const name = m.key?.name
		if (!name) continue
		const scope = extractSlotScope(m.typeAnnotation)
		out.push({
			name,
			scope,
			description: m.range ? findPrecedingComment(comments, m.range[0]) : undefined,
		})
	}
}

function extractSlotScope(typeAnnotationNode: unknown): string[] | undefined {
	if (!typeAnnotationNode) return undefined
	// Drill into TSTypeAnnotation -> actual type
	const t = typeAnnotationNode as { typeAnnotation?: unknown }
	const inner = t.typeAnnotation
	if (!inner) return undefined
	const ft = inner as { type?: string; params?: unknown[]; parameters?: unknown[] }
	if (ft.type !== 'TSFunctionType') return undefined
	const params = ft.params ?? ft.parameters
	if (!params || params.length === 0) return undefined
	const firstParam = params[0] as { typeAnnotation?: unknown }
	if (!firstParam?.typeAnnotation) return undefined
	const t0 = firstParam.typeAnnotation as { typeAnnotation?: { members?: unknown[] } }
	const literal = t0.typeAnnotation
	if (!literal || literal.members === undefined) return undefined
	const out: string[] = []
	for (const member of literal.members) {
		const m = member as { type: string; key?: { name?: string } }
		if (m.type === 'TSPropertySignature' && m.key?.name) {
			out.push(m.key.name)
		}
	}
	return out.length > 0 ? out : undefined
}

/**
 * Collect all `interface X { ... }` and `type X = { ... }` declarations
 * from the AST into a map keyed by alias name. We only retain
 * definitions whose body is a TSTypeLiteral (so we can later look up
 * props by name).
 */
function collectTypeAliases(tsAst: unknown, source: string): Map<string, unknown> {
	const aliases = new Map<string, unknown>()
	const ast = tsAst as { body?: unknown[]; comments?: Array<{ value: string; range: [number, number] }> }
	if (!ast.body) return aliases
	const comments = ast.comments ?? []
	void source
	void comments
	for (const stmt of ast.body) {
		const s = stmt as {
			type?: string
			id?: { name?: string }
			body?: { type: string; body?: unknown[] }
			// type X = { ... }
			declaration?: { type: string; body?: { type: string; members?: unknown[] } }
		}
		if (
			s.type === 'TSInterfaceDeclaration' &&
			s.id?.name &&
			s.body?.type === 'TSInterfaceBody'
		) {
			aliases.set(s.id.name, { type: 'TSTypeLiteral', members: s.body.body ?? [] })
		} else if (
			s.type === 'TSTypeAliasDeclaration' &&
			s.id?.name &&
			s.declaration?.type === 'TSTypeLiteral'
		) {
			aliases.set(
				s.id.name,
				{ type: 'TSTypeLiteral', members: s.declaration.body?.members ?? [] },
			)
		}
	}
	return aliases
}

/**
 * Find the JSDoc comment immediately preceding a given offset. Returns
 * the comment text (with `*` markers stripped) or undefined.
 */
function findPrecedingComment(comments: Array<{ value: string; range: [number, number] }>, offset: number): string | undefined {
	let best: { value: string; range: [number, number] } | null = null
	for (const c of comments) {
		// The comment must end before the target, and the gap should be small.
		if (c.range[1] <= offset && (!best || c.range[1] > best.range[1])) {
			best = c
		}
	}
	if (!best) return undefined
	// Reject if there's too much whitespace between comment and target.
	if (offset - best.range[1] > 5) return undefined
	return best.value.replace(/^\*+/, '').replace(/\*+$/, '').trim()
}

/**
 * Resolve a `TSTypeReference` (possibly `Foo & Bar` or `Foo extends Bar`)
 * to a merged `TSTypeLiteral`. Returns null when any part cannot be
 * resolved.
 */
function resolveToTypeLiteral(
	ref: unknown,
	aliases: Map<string, unknown>,
	depth = 0,
): { type: string; members?: unknown[] } | null {
	if (depth > 4) return null
	const r = ref as {
		type: string
		typeName?: { name?: string }
		typeArguments?: unknown
		// Intersection: A & B
		types?: unknown[]
		// Extends: Foo extends X -> extends[0] is X
		extends?: unknown[]
		// Union: A | B
	}
	if (r.type === 'TSTypeReference') {
		const name = r.typeName?.name
		if (!name) return null
		const alias = aliases.get(name)
		if (alias && (alias as { type: string }).type === 'TSTypeLiteral') {
			return alias as { type: string; members?: unknown[] }
		}
		return null
	}
	if (r.type === 'TSIntersectionType' && Array.isArray(r.types)) {
		const merged: unknown[] = []
		for (const part of r.types) {
			const literal = resolveToTypeLiteral(part, aliases, depth + 1)
			if (!literal) continue
			merged.push(...(literal.members ?? []))
		}
		return { type: 'TSTypeLiteral', members: merged }
	}
	if (r.type === 'TSInterfaceDeclaration') {
		const decl = r as unknown as {
			body?: { type: string; body?: unknown[] }
			extends?: unknown[]
		}
		const merged: unknown[] = []
		if (Array.isArray(decl.extends)) {
			for (const ext of decl.extends) {
				const literal = resolveToTypeLiteral(ext, aliases, depth + 1)
				if (literal) merged.push(...(literal.members ?? []))
			}
		}
		if (decl.body?.type === 'TSInterfaceBody') {
			merged.push(...(decl.body.body ?? []))
		}
		return { type: 'TSTypeLiteral', members: merged }
	}
	return null
}

function extractObjectDefaults(
	objExpr: { properties?: unknown[] } | unknown,
	source: string,
): Map<string, string> {
	const result = new Map<string, string>()
	const obj = objExpr as { properties?: unknown[] }
	if (!obj?.properties) return result
	for (const prop of obj.properties) {
		const p = prop as { type: string; key?: { name?: string }; value?: { range?: [number, number] } }
		if (p.type !== 'Property' || !p.key?.name || !p.value?.range) continue
		const range: RangePair = { start: p.value.range[0], end: p.value.range[1] }
		result.set(p.key.name, source.slice(range.start, range.end).trim())
	}
	return result
}

function typeToString(node: unknown, source: string): string {
	if (!node) return DEFAULT_PROP_TYPE
	const range = (node as { range?: [number, number] }).range
	if (!range) return DEFAULT_PROP_TYPE
	return source.slice(range[0], range[1]).trim()
}

function extractScope(node: unknown, source: string): string[] | undefined {
	if (!node) return undefined
	const typeStr = typeToString(node, source)
	const match = /^\(\s*props\s*:\s*\{\s*([^}]+)\s*\}\s*\)/.exec(typeStr)
	const body = match?.[1]
	if (!body) return undefined
	return body
		.split(',')
		.map((s) => s.trim().split(/\s*:\s*/)[0] ?? '')
		.filter(Boolean)
}

function extractJSDocDescription(
	comments: Array<{ value: string }> | undefined,
): string | undefined {
	if (!comments || comments.length === 0) return undefined
	const joined = comments
		.map((c) => c.value.trim())
		.join(' ')
		.replace(/^\*+\s*/, '')
		.replace(/\*+\s*$/, '')
		.trim()
	return joined.length > 0 ? joined : undefined
}

/**
 * Extract a short description from a Vue SFC's leading JSDoc block.
 */
export function extractDescription(source: string): string {
	const match = /<!--[\s\S]*?-->/.exec(source)
	const commentBlock = match ? source.slice(0, match.index) + source.slice(match.index + match[0].length) : source
	const jsdoc = /\/\*\*([\s\S]*?)\*\//.exec(commentBlock)
	if (!jsdoc || !jsdoc[1]) return ''
	const text = jsdoc[1]
		.split('\n')
		.map((line) => line.replace(/^\s*\*\s?/, '').trim())
		.filter((line) => line.length > 0 && !line.startsWith('@'))
		.join(' ')
	return text
}
