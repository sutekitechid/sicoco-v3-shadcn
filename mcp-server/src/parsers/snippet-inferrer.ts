/**
 * Map a VSCode-style snippet prefix (e.g. "sibutton:primary") to the
 * exported Sicoco component name (e.g. "SButton").
 *
 * The mapping convention is: `si<ComponentName>[:variant]`. We use a
 * lookup table built from the actual exports in `lib/main.ts` so that
 * compound names like `SDatePicker`, `SRichTextEditor`, `SCheckboxGroup`
 * resolve correctly regardless of internal PascalCase boundaries.
 */

export type ComponentLookup = Map<string, string>

/**
 * Build a lookup table from a list of known component names.
 *
 * Keys are the lowercased component name with the leading `S` removed
 * (e.g. "SButton" -> "button", "SDatePicker" -> "datepicker"). Values
 * are the original component names.
 */
export function buildComponentLookup(known: readonly string[]): ComponentLookup {
	const lookup: ComponentLookup = new Map()
	for (const name of known) {
		const stripped = name.startsWith('S') ? name.slice(1) : name
		lookup.set(stripped.toLowerCase(), name)
	}
	return lookup
}

/**
 * Infer the component name from a snippet prefix.
 *
 * Examples:
 *   - "sibutton"            -> "SButton"
 *   - "sibutton:primary"    -> "SButton"
 *   - "sidatepicker"        -> "SDatePicker"
 *   - "sirichtexteditor"    -> "SRichTextEditor"
 *   - "sicheckboxgroup"     -> "SCheckboxGroup"
 *   - "siforminput"         -> "SFormInput"
 *   - "si-formatcurrency"   -> undefined (utility, not a component)
 *   - "si-unknown"          -> undefined
 *
 * Returns the canonical component name (matching one of the `known`
 * list), or undefined if the prefix does not match any component.
 */
export function inferComponentFromPrefix(
	prefix: string,
	lookup: ComponentLookup,
): string | undefined {
	const normalized = prefix
		.replace(/^si/, '')
		.split(/[:.]/)[0]
		?.toLowerCase()
	if (!normalized) return undefined

	// Exact match wins.
	const exact = lookup.get(normalized)
	if (exact) return exact

	// Fallback: prefix match (longest wins). Handles cases where a
	// snippet prefix extends a component name.
	let best: { name: string; length: number } | undefined
	for (const [key, name] of lookup) {
		if (key.length > normalized.length) continue
		if (normalized.startsWith(key) && (!best || key.length > best.length)) {
			best = { name, length: key.length }
		}
	}
	return best?.name
}
