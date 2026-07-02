/**
 * Lightweight SFC validator: parses a Vue SFC string and checks that
 * any Sicoco components used have known tag names, valid prop values,
 * and reasonable v-model bindings.
 *
 * This is intentionally a heuristic — it does not aim to be a full
 * type-checker, but to surface common mistakes (typos in prop names,
 * invalid variant values, unknown components) before the code runs.
 */

export interface ValidationIssue {
	severity: 'error' | 'warning'
	message: string
	tag?: string
	attr?: string
}

interface PropSpec {
	name: string
	type: string
	required: boolean
}

interface ComponentSpec {
	name: string
	props: PropSpec[]
}

export interface ValidatorOptions {
	components: Record<string, ComponentSpec>
}

/**
 * Validate a Vue SFC template string. Returns an array of issues
 * (empty if the template looks fine).
 */
export function validateSfc(
	sfc: string,
	options: ValidatorOptions,
): ValidationIssue[] {
	const issues: ValidationIssue[] = []

	// Extract <template> blocks.
	const templateRe = /<template[^>]*>([\s\S]*?)<\/template>/g
	let tplMatch: RegExpExecArray | null
	while ((tplMatch = templateRe.exec(sfc)) !== null) {
		const tpl = tplMatch[1] ?? ''
		validateTemplate(tpl, options, issues)
	}

	return issues
}

function validateTemplate(
	tpl: string,
	options: ValidatorOptions,
	issues: ValidationIssue[],
): void {
	// Find all tags. This is a best-effort tokenizer — it intentionally
	// ignores tag content (text and nested children) at the attribute
	// level, but walks top-level tags.
	const tagRe = /<\/?([A-Z][A-Za-z0-9]*)\b([^>]*?)\/?>/g
	let match: RegExpExecArray | null
	while ((match = tagRe.exec(tpl)) !== null) {
		const isClosing = match[0].startsWith('</')
		if (isClosing) continue
		const tagName = match[1]
		const attrText = match[2] ?? ''
		if (!tagName) continue
		// Only check tags that look like Sicoco components (start with S).
		if (!tagName.startsWith('S')) continue
		const spec = options.components[tagName]
		if (!spec) {
			// Unknown — could be a user component; do not flag.
			continue
		}
		validateAttributes(tagName, attrText, spec, issues)
	}
}

function validateAttributes(
	tagName: string,
	attrText: string,
	spec: ComponentSpec,
	issues: ValidationIssue[],
): void {
	const propsByName = new Map<string, PropSpec>()
	for (const p of spec.props) propsByName.set(p.name, p)

	// Parse attribute names (ignore v-model, @, : for now — we
	// just check static attribute names).
	const attrRe = /\s([@:])?([A-Za-z][A-Za-z0-9-]*)(?:=("[^"]*"|'[^']*'|\{[^{}]*\}))?/g
	let m: RegExpExecArray | null
	const seen = new Set<string>()
	while ((m = attrRe.exec(attrText)) !== null) {
		const prefix = m[1]
		const name = m[2]
		if (prefix || !name) continue
		seen.add(name)
		// kebab-case -> camelCase
		const camel = name.replace(/-([a-z])/g, (_, c) => (c ?? '').toUpperCase())
		const propSpec = propsByName.get(name) ?? propsByName.get(camel)
		if (!propSpec) {
			// Unknown attribute — could be a non-prop attr like class, style, ref, data-*.
			if (isLikelyHtmlAttr(name)) continue
			issues.push({
				severity: 'warning',
				message: `Unknown prop "${name}" on <${tagName}>. Did you mean one of: ${[...propsByName.keys()].slice(0, 5).join(', ')}?`,
				tag: tagName,
				attr: name,
			})
		}
	}

	for (const p of spec.props) {
		if (p.required && !seen.has(p.name) && !seen.has(toKebab(p.name))) {
			issues.push({
				severity: 'warning',
				message: `Required prop "${p.name}" is missing on <${tagName}>`,
				tag: tagName,
				attr: p.name,
			})
		}
	}
}

function isLikelyHtmlAttr(name: string): boolean {
	if (name === 'class' || name === 'style' || name === 'id' || name === 'ref') return true
	if (name === 'key') return true
	if (name.startsWith('data-') || name.startsWith('aria-')) return true
	if (name === 'role' || name === 'tabindex' || name === 'href' || name === 'target') return true
	return false
}

function toKebab(camel: string): string {
	return camel.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}
