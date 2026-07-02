import type { VariantMeta } from '../types.js'

/**
 * Extract cva-style variant definitions from a component's `index.ts`.
 *
 * The library uses `class-variance-authority` extensively. Each
 * component's `index.ts` typically contains a `cva(base, { variants: {...},
 * defaultVariants: {...} })` call. We parse that call with a focused
 * regex (rather than full TS parsing) because the patterns are uniform
 * across the codebase.
 */
export function extractCvaVariants(source: string): VariantMeta[] {
	const variants: VariantMeta[] = []

	// Find all cva( ... ) invocations. Use a bracket-matching scanner
	// to handle nested braces correctly.
	const cvaCalls = findCvaCalls(source)

	for (const call of cvaCalls) {
		const arg = extractSecondArgument(call)
		if (!arg) continue
		const parsed = parseVariantsObject(arg)
		variants.push(...parsed)
	}

	// De-duplicate by axis name.
	const seen = new Set<string>()
	return variants.filter((v) => {
		if (seen.has(v.name)) return false
		seen.add(v.name)
		return true
	})
}

function findCvaCalls(source: string): string[] {
	const calls: string[] = []
	const re = /\bcva\s*\(/g
	let match: RegExpExecArray | null
	while ((match = re.exec(source)) !== null) {
		const start = match.index + match[0].length
		const end = matchBalancedBrace(source, start - 1)
		if (end > start) {
			calls.push(source.slice(start, end))
		}
	}
	return calls
}

function matchBalancedBrace(source: string, openIdx: number): number {
	// openIdx points at the '{' of cva's options object.
	let depth = 0
	let inString: string | null = null
	for (let i = openIdx; i < source.length; i++) {
		const ch = source[i]
		const prev = i > 0 ? source[i - 1] : ''
		if (inString) {
			if (ch === inString && prev !== '\\') inString = null
			continue
		}
		if (ch === '"' || ch === "'" || ch === '`') {
			inString = ch
			continue
		}
		if (ch === '{') depth++
		else if (ch === '}') {
			depth--
			if (depth === 0) return i
		}
	}
	return -1
}

function extractSecondArgument(cvaCall: string): string | null {
	// cvaCall is the content INSIDE cva(...), e.g. "'base', { ... }"
	// We want the second argument, the options object.
	const commaIdx = findTopLevelComma(cvaCall)
	if (commaIdx < 0) return null
	return cvaCall.slice(commaIdx + 1).trim()
}

function findTopLevelComma(s: string): number {
	let depth = 0
	let inString: string | null = null
	for (let i = 0; i < s.length; i++) {
		const ch = s[i]
		const prev = i > 0 ? s[i - 1] : ''
		if (inString) {
			if (ch === inString && prev !== '\\') inString = null
			continue
		}
		if (ch === '"' || ch === "'" || ch === '`') {
			inString = ch
			continue
		}
		if (ch === '(' || ch === '[' || ch === '{') depth++
		else if (ch === ')' || ch === ']' || ch === '}') depth--
		else if (ch === ',' && depth === 0) return i
	}
	return -1
}

function parseVariantsObject(objectLiteral: string): VariantMeta[] {
	const out: VariantMeta[] = []
	const re = /variants\s*:\s*\{/g
	let m: RegExpExecArray | null
	while ((m = re.exec(objectLiteral)) !== null) {
		const blockStart = m.index + m[0].length
		const blockEnd = matchBalancedBrace(objectLiteral, blockStart - 1)
		if (blockEnd < 0) continue
		const block = objectLiteral.slice(blockStart, blockEnd)

		// Within the variants block, find each axis:  axisName: { values... }
		const axisRe = /(\w+)\s*:\s*\{/g
		let am: RegExpExecArray | null
		while ((am = axisRe.exec(block)) !== null) {
			const axisName = am[1]
			if (!axisName) continue
			const valuesStart = am.index + am[0].length
			const valuesEnd = matchBalancedBrace(block, valuesStart - 1)
			if (valuesEnd < 0) continue
			const valuesBody = block.slice(valuesStart, valuesEnd)
			const values = extractStringKeys(valuesBody)
			if (values.length > 0) {
				out.push({ name: axisName, values })
			}
		}
	}

	// Find defaultVariants to annotate defaults.
	const defaultRe = /defaultVariants\s*:\s*\{/
	const defaultMatch = defaultRe.exec(objectLiteral)
	if (defaultMatch) {
		const defaultStart = defaultMatch.index + defaultMatch[0].length
		const defaultEnd = matchBalancedBrace(objectLiteral, defaultStart - 1)
		if (defaultEnd > 0) {
			const defaultBody = objectLiteral.slice(defaultStart, defaultEnd)
			// Match either 'string', "string", or a JS primitive (true/false/null/number).
			const axisDefaultRe = /(\w+)\s*:\s*(?:'([^']*)'|"([^"]*)"|(true|false|null|-?\d+(?:\.\d+)?))/g
			let dm: RegExpExecArray | null
			while ((dm = axisDefaultRe.exec(defaultBody)) !== null) {
				const axis = dm[1]
				const value = dm[2] ?? dm[3] ?? dm[4] ?? ''
				if (!axis) continue
				const target = out.find((v) => v.name === axis)
				if (target) target.default = value
			}
		}
	}

	return out
}

function extractStringKeys(objectBody: string): string[] {
	const keys: string[] = []
	// Match both quoted and unquoted keys.
	const re = /(?:'([^']+)'|"([^"]+)"|([A-Za-z_][A-Za-z0-9_-]*))\s*:/g
	let m: RegExpExecArray | null
	while ((m = re.exec(objectBody)) !== null) {
		const key = m[1] ?? m[2] ?? m[3]
		if (key) keys.push(key)
	}
	return keys
}
