import chroma from 'chroma-js'

/**
 * Chroma.js color scale utilities.
 *
 * Provides a `generateLabShades` function that produces a perceptually-uniform
 * 11-shade color scale (50, 100, 200, ..., 950) from a single input color,
 * using a reference palette for curve shape and an anchor-based delta
 * scaling approach to keep shades distinct and avoid white-out at extremes.
 *
 * Algorithm overview
 * ------------------
 * 1. Compute HSL offsets between reference 500 and user color:
 *    - hueShift  = userHue   - refHue   (additive degrees)
 *    - satScale  = userSat   / refSat   (multiplicative)
 * 2. Lightness: anchor-based delta scaling
 *    - newL = userL500 + (refL[i] - refL500) * scale
 *    - scale = lightScale for i < 5  (headroom toward MAX_LIGHTNESS)
 *    - scale = darkScale  for i > 5  (footroom toward MIN_LIGHTNESS)
 * 3. Build 11 transformed control points (HSL); replace index 5 with user color
 * 4. chroma.scale(...).mode('lab') interpolates smoothly through 11 points
 * 5. Sample at 11 evenly-spaced t-values (0, 0.1, ..., 1.0)
 *
 * Why it produces exact match for reference input:
 *   When user color equals ref[5], all deltas = 0 and all scales = 1.
 *   HSL hue rotation by 0° is identity, and the HSL→RGB round-trip is
 *   lossless for sRGB-gamut colors. Result: every shade equals ref[i].
 *
 * Why it adapts to all other inputs:
 *   All 11 control points get transformed, not just the anchor. This means
 *   the whole palette shifts (hue + saturation + lightness) to match the
 *   user's color, while preserving the designer's curve shape.
 *
 * @example
 *   const palette = generateLabShades({
 *     input: '#3b82f6',
 *     reference: [[234,237,255], [212,219,254], ..., [0,12,42]]
 *   })
 *   // returns 11 [r, g, b] tuples for shades 50, 100, ..., 950
 */

export type RGB = [number, number, number]

export interface LabShadesOptions {
	/** User's color as hex string (e.g. '#3b82f6'). */
	input: string
	/** Reference 11-shade palette as RGB tuples. Index 5 is the anchor (e.g. primary-500). */
	reference: readonly RGB[]
	/** Lightness safety bounds. Defaults: 0.05 (min) and 0.97 (max). */
	minLightness?: number
	maxLightness?: number
}

/** Standard 11-shade scale (Tailwind-compatible). */
export const PRIMARY_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
export type PrimaryStop = (typeof PRIMARY_STOPS)[number]

const BASE_INDEX = 5

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value))
}

/**
 * Generate 11 RGB shades using Lab scale + H/S/L transform with anchor-based
 * delta scaling. See file-level JSDoc for algorithm details.
 */
export function generateLabShades(options: LabShadesOptions): RGB[] {
	const { input, reference } = options
	const minLightness = options.minLightness ?? 0.05
	const maxLightness = options.maxLightness ?? 0.97

	const userHSL = chroma(input).hsl() as [number, number, number]
	const [r500, g500, b500] = reference[BASE_INDEX]
	const refHSL500 = chroma.rgb(r500, g500, b500).hsl() as [number, number, number]

	// Compute HSL offsets from reference 500 to user color
	const hueShift: number =
		isNaN(userHSL[0]) || isNaN(refHSL500[0]) ? 0 : userHSL[0] - refHSL500[0]
	const satScale: number = userHSL[1] / refHSL500[1]

	// Lightness scaling: scale relative delta to fit within available headroom/footroom
	// from the user's anchor position. Preserves curve shape and prevents clamping collisions.
	const lightScale = (maxLightness - userHSL[2]) / (maxLightness - refHSL500[2])
	const darkScale = (userHSL[2] - minLightness) / (refHSL500[2] - minLightness)
	const safeLightScale = isFinite(lightScale) && lightScale >= 0 ? lightScale : 1
	const safeDarkScale = isFinite(darkScale) && darkScale >= 0 ? darkScale : 1

	// Build 11 control points (HSL-transformed) and replace anchor at index 5
	const controlPoints = reference.map((rgb: RGB, i: number) => {
		if (i === BASE_INDEX) return chroma(input)

		const [r, g, b] = rgb
		const [h, s, l] = chroma.rgb(r, g, b).hsl()
		const scale = i < BASE_INDEX ? safeLightScale : safeDarkScale
		const newL = clamp(
			userHSL[2] + (l - refHSL500[2]) * scale,
			minLightness,
			maxLightness
		)

		// Grayscale shades (S<0.01): no hue/sat to transform
		if (s < 0.01) return chroma.hsl(0, 0, newL)

		const newH = isNaN(h) ? 0 : ((h + hueShift) % 360 + 360) % 360
		const newS = clamp(s * satScale, 0, 1)
		return chroma.hsl(newH, newS, newL)
	})

	const scale = chroma.scale(controlPoints).mode('lab')
	return PRIMARY_STOPS.map(
		(_, i) => scale(i / (PRIMARY_STOPS.length - 1)).rgb() as RGB
	)
}

/**
 * Read an 11-shade palette from CSS custom properties on :root.
 * Each variable should be a space-separated RGB triple (e.g. "234 237 255").
 * Returns null if any shade is missing or invalid.
 */
export function readPaletteFromCss(varPrefix: string): RGB[] | null {
	if (typeof document === 'undefined') return null
	const computed = getComputedStyle(document.documentElement)
	const palette: RGB[] = []
	for (const stop of PRIMARY_STOPS) {
		const raw = computed.getPropertyValue(`${varPrefix}-${stop}`).trim()
		const parts = raw.split(/\s+/).map(n => Number(n))
		if (parts.length !== 3 || parts.some(n => isNaN(n))) return null
		palette.push(parts as RGB)
	}
	return palette
}

/** Default primary palette from `lib/config/tailwind.css` (used as fallback). */
export const FALLBACK_PRIMARY_PALETTE: readonly RGB[] = [
	[234, 237, 255], [212, 219, 254], [167, 185, 254], [122, 153, 253],
	[53, 119, 253], [11, 90, 208], [7, 72, 169], [4, 55, 133],
	[2, 36, 94], [1, 21, 61], [0, 12, 42],
] as const
