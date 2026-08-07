import {
	generateLabShades,
	readPaletteFromCss,
	FALLBACK_PRIMARY_PALETTE,
	PRIMARY_STOPS,
	type RGB,
} from '../../lib/utils/chromajs'
import chroma from 'chroma-js'

/**
 * Composable untuk apply custom primary color via CSS variables.
 *
 * Approach: Read primary palette dari @lib/config/tailwind.css via CSS variables
 * at runtime, then generate a new palette by adapting the designer's curve
 * shape to the user's input color (Lab scale + H/S/L transform).
 *
 * Benefits:
 * - Single source of truth: tailwind.css is the canonical primary palette
 * - Self-adapting ke theme overrides (purple, dark mode, etc.)
 * - No hardcoded values — composer akan reflect apapun yang didefine di tailwind.css
 * - Update tailwind.css → composable automatically uses new values
 *
 * Algorithm (delegated to lib/utils/chromajs.ts):
 * 1. Read --color-primary-{50-950} dari computed CSS (current theme)
 * 2. Compute HSL offsets: hueShift, satScale, lightDelta
 * 3. Transform each of 11 primary shades with anchor-based delta scaling
 *    to avoid white-out at extremes (preserves curve shape)
 * 4. chroma.scale with the 11 transformed control points in Lab space
 * 5. Apply output to --color-primary-{50-950} CSS variables
 *
 * Exact match guarantee: when input equals primary 500, all transforms are
 * identity (offsets = 0, scales = 1) so every output shade equals the
 * reference palette (ΔE 0.00).
 */

const DEFINED_THEMES = ['purple'] as const
const BASE_INDEX = 5 // shade 500 (anchor) — kept for other reference helpers

type OKLCH = [number, number, number]

function normalizeHue(hue: number): number {
	return ((hue % 360) + 360) % 360
}

function checkValidHexColor(color: string | null): boolean {
	if (color === null) return false
	const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i
	return hexColorRegex.test(color)
}

/**
 * Build reference curves (L, C, H shift) dari RGB palette.
 * Each RGB converted to OKLCH.
 *
 * H shift = absolute target H minus base H (relative offset).
 */
function buildReferenceCurves(palette: RGB[]): { L: number[]; C: number[]; H: number[] } {
	const oklch = palette.map((rgb) => {
		const [r, g, b] = rgb
		return chroma.rgb(r, g, b).oklch() as OKLCH
	})
	const baseH = oklch[BASE_INDEX][2]

	return {
		L: oklch.map(([l]) => l),
		C: oklch.map(([, c]) => c),
		H: oklch.map(([, , h]) => normalizeHue(h - baseH)),
	}
}

// Cache reference curves (computed once per theme change)
let cachedPalette: RGB[] | null = null
let cachedCurves: ReturnType<typeof buildReferenceCurves> | null = null

function getReferenceCurves(): ReturnType<typeof buildReferenceCurves> {
	const palette = readPaletteFromCss('--color-primary')
	if (palette) {
		const changed = !cachedPalette || palette.some((rgb, i) => {
			const cached = cachedPalette![i]
			return rgb[0] !== cached[0] || rgb[1] !== cached[1] || rgb[2] !== cached[2]
		})
		if (changed) {
			cachedPalette = palette
			cachedCurves = buildReferenceCurves(palette)
		}
	}
	if (cachedCurves) return cachedCurves

	// Fallback: hardcoded primary palette
	cachedPalette = FALLBACK_PRIMARY_PALETTE.slice() as RGB[]
	cachedCurves = buildReferenceCurves(FALLBACK_PRIMARY_PALETTE as RGB[])
	return cachedCurves!
}

/**
 * Generate 11 shades menggunakan OKLCH + L/C/H curves.
 * Return array of [r, g, b] untuk setiap stop.
 *
 * 3 dimensions are varied independently:
 * - L: REFERENCE_LIGHTNESS + offset (anchored at user color's L)
 * - C: REFERENCE_CHROMA * (user chroma / reference chroma at 500)
 * - H: user hue + REFERENCE_HUE_SHIFT (light shades shift toward purple)
 */
export function generatePrimaryShades(hexColor: string): RGB[] {
	const curves = getReferenceCurves()
	const baseOKLCH = chroma(hexColor).oklch() as OKLCH
	const [baseL, baseC, baseH] = baseOKLCH
	const baseOffset = baseL - curves.L[BASE_INDEX]
	const chromaScale = baseC / curves.C[BASE_INDEX]

	return PRIMARY_STOPS.map((_, i) => {
		const targetL = Math.max(0, Math.min(1, curves.L[i] + baseOffset))
		const targetC = curves.C[i] * chromaScale
		const targetH = normalizeHue(baseH + curves.H[i])
		return chroma.oklch(targetL, targetC, targetH).rgb() as RGB
	})
}

/**
 * Generate 11 shades menggunakan OKLCH tanpa hue shift (untuk comparison).
 */
export function generateOklchConstHueShades(hexColor: string): RGB[] {
	const curves = getReferenceCurves()
	const baseOKLCH = chroma(hexColor).oklch() as OKLCH
	const [baseL, baseC, baseH] = baseOKLCH
	const baseOffset = baseL - curves.L[BASE_INDEX]
	const chromaScale = baseC / curves.C[BASE_INDEX]

	return PRIMARY_STOPS.map((_, i) => {
		const targetL = Math.max(0, Math.min(1, curves.L[i] + baseOffset))
		const targetC = curves.C[i] * chromaScale
		return chroma.oklch(targetL, targetC, baseH).rgb() as RGB
	})
}

/**
 * Generate 11 shades menggunakan OKLCH Delta approach.
 * @see lib/utils/chromajs.ts for Lab Delta equivalent
 */
export function generateOklchDeltaShades(hexColor: string): RGB[] {
	const curves = getReferenceCurves()
	const baseOKLCH = chroma(hexColor).oklch() as OKLCH
	const [baseL, baseC, baseH] = baseOKLCH

	const dL: number[] = []
	const dC: number[] = []
	const dH: number[] = []
	for (let i = 0; i < PRIMARY_STOPS.length - 1; i++) {
		dL.push(curves.L[i + 1] - curves.L[i])
		dC.push(curves.C[i + 1] - curves.C[i])
		const hDiff = curves.H[i + 1] - curves.H[i]
		dH.push(((hDiff + 540) % 360) - 180)
	}

	const chromaScale = baseC / curves.C[BASE_INDEX]
	const result: OKLCH[] = new Array(PRIMARY_STOPS.length)
	result[BASE_INDEX] = [baseL, baseC, baseH]

	for (let i = BASE_INDEX; i > 0; i--) {
		const prev = result[i]
		const deltaIdx = i - 1
		result[i - 1] = [
			Math.max(0, Math.min(1, prev[0] - dL[deltaIdx])),
			Math.max(0, prev[1] - dC[deltaIdx] * chromaScale),
			normalizeHue(prev[2] - dH[deltaIdx]),
		]
	}
	for (let i = BASE_INDEX; i < PRIMARY_STOPS.length - 1; i++) {
		const prev = result[i]
		result[i + 1] = [
			Math.max(0, Math.min(1, prev[0] + dL[i])),
			Math.max(0, prev[1] + dC[i] * chromaScale),
			normalizeHue(prev[2] + dH[i]),
		]
	}

	return result.map(([l, c, h]) => chroma.oklch(l, c, h).rgb() as RGB)
}

/**
 * Re-export Lab Scale generator from utility module.
 * @see lib/utils/chromajs.ts
 */
export { generateLabShades } from '../../lib/utils/chromajs'

/**
 * Generate 11 shades menggunakan HSL Lightness Curve (untuk comparison).
 */
export function generateHslShades(hexColor: string): RGB[] {
	const curves = getReferenceCurves()
	const baseHSL = chroma(hexColor).hsl() as OKLCH
	const [baseH, baseS, baseL] = baseHSL
	const baseOffset = baseL - curves.L[BASE_INDEX]

	return PRIMARY_STOPS.map((_, i) => {
		const targetL = Math.max(0, Math.min(1, curves.L[i] + baseOffset))
		return chroma.hsl(baseH, baseS, targetL).rgb() as RGB
	})
}

/**
 * Apply primary color via CSS variables.
 * @param color - hex color string (e.g., '#3b82f6') or predefined theme name ('purple') or null
 */
export function useColorTheme(color: string | null): void {
	if (typeof document === 'undefined') return

	if (color !== null && (DEFINED_THEMES as readonly string[]).includes(color)) {
		document.documentElement.setAttribute('data-theme', color)
		cachedPalette = null
		cachedCurves = null
		return
	}

	if (!checkValidHexColor(color)) return

	// Use Lab Scale approach (delegated to lib/utils/chromajs.ts)
	// Best performer: exact match for primary input, scales well to diverse colors
	const palette = readPaletteFromCss('--color-primary') || FALLBACK_PRIMARY_PALETTE
	const shades = generateLabShades({
		input: color as string,
		reference: palette as readonly RGB[],
	})
	PRIMARY_STOPS.forEach((stop, i) => {
		document.documentElement.style.setProperty(`--color-primary-${stop}`, shades[i].join(' '))
	})
}

/**
 * Invalidate cache — call after theme change to force re-reading CSS variables.
 */
export function invalidateReferenceCache(): void {
	cachedPalette = null
	cachedCurves = null
}
