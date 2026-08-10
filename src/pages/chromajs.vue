<template>
	<div class="p-6 max-w-6xl mx-auto">
		<h1 class="text-2xl font-bold mb-2">Chroma.js Demo: Color Scale Generation</h1>
		<p class="text-neutral-600 mb-6">
			Compare 3 approaches to generate 11-shade color scale from a single hex input.
		</p>

		<!-- Input Section -->
		<div class="mb-8 p-4 border border-neutral-300 rounded-lg">
			<label class="block text-sm font-semibold mb-2">Input Color (Hex)</label>
			<div class="flex gap-2 items-center">
				<Input
					v-model="inputColor"
					placeholder="#3b82f6"
					class="font-mono"
				/>
				<Button @click="applyTheme">Apply to App</Button>
				<Button variant="default" @click="resetTheme">Reset</Button>
			</div>
			<div class="flex gap-2 mt-3">
				<button
					v-for="preset in presetColors"
					:key="preset"
					@click="inputColor = preset"
					class="px-3 py-1 text-xs font-mono border border-neutral-300 rounded-sm hover:bg-neutral-100"
				>
					{{ preset }}
				</button>
			</div>
		</div>

		<!-- Comparison: 3 Approaches -->
		<div class="space-y-8">
			<!-- Approach A: Lab Scale (Hue-Rotated Primary CP) -->
			<section>
				<div class="flex items-baseline justify-between mb-3">
					<h2 class="text-lg font-semibold">A. Lab Scale (Hue-Rotated) ⭐</h2>
					<span class="text-xs text-neutral-500 font-mono">
						chroma.scale([{hue-shifted primaryPalette}, userColor@500]).mode('lab')
					</span>
				</div>
				<ColorScale :shades="labShades" :input-color="inputColor" />
			</section>

			<!-- Approach B: Pure Delta RGB -->
			<section>
				<div class="flex items-baseline justify-between mb-3">
					<h2 class="text-lg font-semibold">B. Pure Delta RGB</h2>
					<span class="text-xs text-neutral-500 font-mono">
						Apply primary palette RGB deltas to user color
					</span>
				</div>
				<ColorScale :shades="deltaShades" :input-color="inputColor" />
			</section>

			<!-- Approach C: HSL Lightness Curve -->
			<section>
				<div class="flex items-baseline justify-between mb-3">
					<h2 class="text-lg font-semibold text-neutral-600">
						C. HSL Lightness Curve
					</h2>
					<span class="text-xs text-neutral-500 font-mono">
						chroma.hsl(h, s, l) — fails at L>0.95 with high S (produces white)
					</span>
				</div>
				<ColorScale :shades="hslShades" :input-color="inputColor" />
			</section>

			<!-- Approach D: OKLCH Lightness + Chroma Curve -->
			<section>
				<div class="flex items-baseline justify-between mb-3">
					<h2 class="text-lg font-semibold text-neutral-600">
						D. OKLCH L + C (no H shift)
					</h2>
					<span class="text-xs text-neutral-500 font-mono">
						chroma.oklch(l, c, h) — varies L+C only
					</span>
				</div>
				<ColorScale :shades="oklchShades" :input-color="inputColor" />
			</section>

			<!-- Approach E: OKLCH L + C + H shift (Recommended) -->
			<section>
				<div class="flex items-baseline justify-between mb-3">
					<h2 class="text-lg font-semibold text-primary-600">
						E. OKLCH L + C + H shift ⭐
					</h2>
					<span class="text-xs text-neutral-500 font-mono">
						chroma.oklch(l, c, h+shift) — full designer curve (L+C+H)
					</span>
				</div>
				<ColorScale :shades="oklchHueShades" :input-color="inputColor" />
			</section>

			<!-- Approach F: OKLCH Delta (cumulative steps) -->
			<section>
				<div class="flex items-baseline justify-between mb-3">
					<h2 class="text-lg font-semibold text-neutral-600">
						F. OKLCH Delta
					</h2>
					<span class="text-xs text-neutral-500 font-mono">
						Δ approach: shade_N = shade_(N-1) + delta_(N-1), anchored at 500
					</span>
				</div>
				<ColorScale :shades="oklchDeltaShades" :input-color="inputColor" />
			</section>

			<!-- Reference: Tailwind blue-500 (for comparison) -->
			<section>
				<div class="flex items-baseline justify-between mb-3">
					<h2 class="text-lg font-semibold text-neutral-500">
						Reference: Tailwind blue-500
					</h2>
					<span class="text-xs text-neutral-500 font-mono">
						Designer-crafted palette
					</span>
				</div>
				<ColorScale
					:shades="tailwindBlue500"
					:input-color="'#3b82f6'"
					:is-reference="true"
				/>
			</section>
		</div>

		<!-- Visual Comparison Table: All methods side by side -->
		<div class="mt-10">
			<h2 class="text-lg font-semibold mb-3">
				Visual Comparison: primary-50 → primary-950
			</h2>
			<p class="text-sm text-neutral-600 mb-4">
				All 4 methods compared side by side. <strong>Closest match to Tailwind reference (bottom row) = best.</strong>
			</p>

			<!-- Header: shade labels -->
			<div class="grid grid-cols-[160px_repeat(11,1fr)] gap-1 items-center mb-2">
				<div></div>
				<div
					v-for="stop in stops"
					:key="`header-${stop}`"
					class="text-center text-[10px] font-mono font-semibold text-neutral-600"
				>
					{{ stop }}
				</div>
			</div>

<!-- Row: A. Lab Scale (primary CP) -->
			<div class="grid grid-cols-[160px_repeat(11,1fr)] gap-1 items-center mb-1">
				<div class="text-xs font-semibold pr-2 text-primary-600">
					A. Lab Scale ⭐
				</div>
				<div
					v-for="(shade, i) in labShades"
					:key="`row-lab-${i}`"
					class="aspect-square rounded-sm flex items-center justify-center text-[9px] font-mono border-2 border-primary-400"
					:style="{
						backgroundColor: `rgb(${shade[0]}, ${shade[1]}, ${shade[2]})`,
						color: getContrastColorForShade(shade),
					}"
				>
					{{ shade[0] }}
				</div>
			</div>

			<!-- Row: B. Delta -->
			<div class="grid grid-cols-[160px_repeat(11,1fr)] gap-1 items-center mb-1">
				<div class="text-xs font-semibold pr-2">B. Delta</div>
				<div
					v-for="(shade, i) in deltaShades"
					:key="`row-delta-${i}`"
					class="aspect-square rounded-sm flex items-center justify-center text-[9px] font-mono"
					:style="{
						backgroundColor: `rgb(${shade[0]}, ${shade[1]}, ${shade[2]})`,
						color: getContrastColorForShade(shade),
					}"
				>
					{{ shade[0] }}
				</div>
			</div>

			<!-- Row: C. HSL Curve -->
			<div class="grid grid-cols-[160px_repeat(11,1fr)] gap-1 items-center mb-1">
				<div class="text-xs font-semibold pr-2 text-neutral-600">
					C. HSL Curve
				</div>
				<div
					v-for="(shade, i) in hslShades"
					:key="`row-hsl-${i}`"
					class="aspect-square rounded-sm flex items-center justify-center text-[9px] font-mono"
					:style="{
						backgroundColor: `rgb(${shade[0]}, ${shade[1]}, ${shade[2]})`,
						color: getContrastColorForShade(shade),
					}"
				>
					{{ shade[0] }}
				</div>
			</div>

			<!-- Row: D. OKLCH Curve -->
			<div class="grid grid-cols-[160px_repeat(11,1fr)] gap-1 items-center mb-1">
				<div class="text-xs font-semibold pr-2 text-neutral-600">
					D. OKLCH L+C
				</div>
				<div
					v-for="(shade, i) in oklchShades"
					:key="`row-oklch-${i}`"
					class="aspect-square rounded-sm flex items-center justify-center text-[9px] font-mono"
					:style="{
						backgroundColor: `rgb(${shade[0]}, ${shade[1]}, ${shade[2]})`,
						color: getContrastColorForShade(shade),
					}"
				>
					{{ shade[0] }}
				</div>
			</div>

			<!-- Row: E. OKLCH + H shift (Recommended) -->
			<div class="grid grid-cols-[160px_repeat(11,1fr)] gap-1 items-center mb-1">
				<div class="text-xs font-semibold pr-2 text-primary-600">
					E. OKLCH L+C+H ⭐
				</div>
				<div
					v-for="(shade, i) in oklchHueShades"
					:key="`row-oklch-hue-${i}`"
					class="aspect-square rounded-sm flex items-center justify-center text-[9px] font-mono border-2 border-primary-400"
					:style="{
						backgroundColor: `rgb(${shade[0]}, ${shade[1]}, ${shade[2]})`,
						color: getContrastColorForShade(shade),
					}"
				>
					{{ shade[0] }}
				</div>
			</div>

			<!-- Row: F. OKLCH Delta -->
			<div class="grid grid-cols-[160px_repeat(11,1fr)] gap-1 items-center mb-1">
				<div class="text-xs font-semibold pr-2 text-neutral-600">
					F. OKLCH Delta
				</div>
				<div
					v-for="(shade, i) in oklchDeltaShades"
					:key="`row-oklch-delta-${i}`"
					class="aspect-square rounded-sm flex items-center justify-center text-[9px] font-mono"
					:style="{
						backgroundColor: `rgb(${shade[0]}, ${shade[1]}, ${shade[2]})`,
						color: getContrastColorForShade(shade),
					}"
				>
					{{ shade[0] }}
				</div>
			</div>

			<!-- Row: Tailwind Reference -->
			<div class="grid grid-cols-[160px_repeat(11,1fr)] gap-1 items-center">
				<div class="text-xs font-semibold pr-2 text-neutral-500">
					Tailwind (target)
				</div>
				<div
					v-for="(shade, i) in primaryPalette"
					:key="`row-tw-${i}`"
					class="aspect-square rounded-sm flex items-center justify-center text-[9px] font-mono"
					:style="{
						backgroundColor: `rgb(${shade[0]}, ${shade[1]}, ${shade[2]})`,
						color: getContrastColorForShade(shade),
					}"
				>
					{{ shade[0] }}
				</div>
			</div>
		</div>

		<!-- Difference vs Tailwind (per shade) -->
		<div class="mt-8">
			<h2 class="text-lg font-semibold mb-3">
				Color Distance vs Tailwind Reference
			</h2>
			<p class="text-sm text-neutral-600 mb-4">
				Delta-E (lower = closer to Tailwind). Calculated using chroma.deltaE() with default 'lab' method.
			</p>
			<div class="overflow-x-auto">
				<table class="w-full text-xs font-mono">
					<thead>
						<tr class="border-b border-neutral-300">
							<th class="text-left p-2">Method</th>
							<th
								v-for="stop in stops"
								:key="`dist-h-${stop}`"
								class="p-2 text-center"
							>
								{{ stop }}
							</th>
							<th class="p-2 text-center bg-neutral-100">Avg</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold text-primary-600">A. Lab Scale ⭐</td>
							<td
								v-for="(d, i) in labDistances"
								:key="`lab-d-${i}`"
								class="p-2 text-center"
								:style="{ backgroundColor: getDistanceColor(d) }"
							>
								{{ d.toFixed(1) }}
							</td>
							<td class="p-2 text-center bg-neutral-100 font-semibold">
								{{ avgLab.toFixed(1) }}
							</td>
						</tr>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold">B. Delta RGB</td>
							<td
								v-for="(d, i) in deltaDistances"
								:key="`delta-d-${i}`"
								class="p-2 text-center"
								:style="{ backgroundColor: getDistanceColor(d) }"
							>
								{{ d.toFixed(1) }}
							</td>
							<td class="p-2 text-center bg-neutral-100 font-semibold">
								{{ avgDelta.toFixed(1) }}
							</td>
						</tr>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold text-neutral-600">C. HSL Curve</td>
							<td
								v-for="(d, i) in hslDistances"
								:key="`hsl-d-${i}`"
								class="p-2 text-center"
								:style="{ backgroundColor: getDistanceColor(d) }"
							>
								{{ d.toFixed(1) }}
							</td>
							<td class="p-2 text-center bg-neutral-100 font-semibold">
								{{ avgHsl.toFixed(1) }}
							</td>
						</tr>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold text-neutral-600">D. OKLCH L+C</td>
							<td
								v-for="(d, i) in oklchDistances"
								:key="`oklch-d-${i}`"
								class="p-2 text-center"
								:style="{ backgroundColor: getDistanceColor(d) }"
							>
								{{ d.toFixed(1) }}
							</td>
							<td class="p-2 text-center bg-neutral-100 font-semibold">
								{{ avgOklch.toFixed(1) }}
							</td>
						</tr>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold text-primary-600">E. OKLCH L+C+H ⭐</td>
							<td
								v-for="(d, i) in oklchHueDistances"
								:key="`oklch-hue-d-${i}`"
								class="p-2 text-center"
								:style="{ backgroundColor: getDistanceColor(d) }"
							>
								{{ d.toFixed(1) }}
							</td>
							<td class="p-2 text-center bg-neutral-100 font-semibold">
								{{ avgOklchHue.toFixed(1) }}
							</td>
						</tr>
						<tr>
							<td class="p-2 font-semibold text-neutral-600">F. OKLCH Δ</td>
							<td
								v-for="(d, i) in oklchDeltaDistances"
								:key="`oklch-delta-d-${i}`"
								class="p-2 text-center"
								:style="{ backgroundColor: getDistanceColor(d) }"
							>
								{{ d.toFixed(1) }}
							</td>
							<td class="p-2 text-center bg-neutral-100 font-semibold">
								{{ avgOklchDelta.toFixed(1) }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p class="text-[10px] text-neutral-500 mt-2">
				<strong>Delta-E scale:</strong> 0-1 = imperceptible, 1-2 = perceptible on close inspection,
				2-10 = perceptible at a glance, 11-49 = colors are more similar than opposite, 100 = exact opposite.
			</p>
		</div>

		<!-- Numerical Comparison Table -->
		<div class="mt-10">
			<h2 class="text-lg font-semibold mb-3">RGB Values Comparison</h2>
			<div class="overflow-x-auto">
				<table class="w-full text-xs font-mono border-collapse">
					<thead>
						<tr class="border-b border-neutral-300">
							<th class="text-left p-2 sticky left-0 bg-white">Shade</th>
							<th
								v-for="stop in stops"
								:key="stop"
								class="p-2 text-center"
								:style="{ backgroundColor: `rgba(0,0,0,0.05)` }"
							>
								{{ stop }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold sticky left-0 bg-white text-primary-600">A. Lab Scale ⭐</td>
							<td
								v-for="(shade, i) in labShades"
								:key="`lab-${i}`"
								class="p-2 text-center text-primary-600"
							>
								{{ shade.join(' ') }}
							</td>
						</tr>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold sticky left-0 bg-white">B. Delta RGB</td>
							<td
								v-for="(shade, i) in deltaShades"
								:key="`delta-${i}`"
								class="p-2 text-center"
							>
								{{ shade.join(' ') }}
							</td>
						</tr>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold sticky left-0 bg-white text-neutral-600">C. HSL</td>
							<td
								v-for="(shade, i) in hslShades"
								:key="`hsl-${i}`"
								class="p-2 text-center text-neutral-600"
							>
								{{ shade.join(' ') }}
							</td>
						</tr>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold sticky left-0 bg-white text-neutral-600">D. OKLCH</td>
							<td
								v-for="(shade, i) in oklchShades"
								:key="`oklch-${i}`"
								class="p-2 text-center text-neutral-600"
							>
								{{ shade.join(' ') }}
							</td>
						</tr>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold sticky left-0 bg-white text-primary-600">E. OKLCH+H ⭐</td>
							<td
								v-for="(shade, i) in oklchHueShades"
								:key="`oklch-hue-${i}`"
								class="p-2 text-center text-primary-600"
							>
								{{ shade.join(' ') }}
							</td>
						</tr>
						<tr class="border-b border-neutral-100">
							<td class="p-2 font-semibold sticky left-0 bg-white text-neutral-600">F. OKLCH Δ</td>
							<td
								v-for="(shade, i) in oklchDeltaShades"
								:key="`oklch-delta-${i}`"
								class="p-2 text-center text-neutral-600"
							>
								{{ shade.join(' ') }}
							</td>
						</tr>
						<tr>
							<td class="p-2 font-semibold sticky left-0 bg-white text-neutral-500">
								Tailwind
							</td>
							<td
								v-for="(shade, i) in tailwindBlue500"
								:key="`tw-${i}`"
								class="p-2 text-center text-neutral-500"
							>
								{{ shade.join(' ') }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Live Demo: Tailwind primary-{shade} classes -->
		<div class="mt-10">
			<h2 class="text-lg font-semibold mb-3">
				Live Demo: <code class="text-sm font-mono bg-neutral-100 px-1 rounded-sm">bg-primary-{shade}</code>
			</h2>
			<p class="text-sm text-neutral-600 mb-4">
				These swatches use the actual Tailwind classes. They reflect the current theme:
				<span class="font-mono">--color-primary-50</span> through <span class="font-mono">--color-primary-950</span>.
				<br>
				Click <strong>Apply to App</strong> to update the theme and see these swatches change live.
			</p>

			<!-- Light Mode Swatches -->
			<div class="mb-6">
				<h3 class="text-sm font-semibold mb-2 text-neutral-700">Light Mode (default)</h3>
				<div class="grid grid-cols-11 gap-1">
					<div
						v-for="stop in stops"
						:key="`light-${stop}`"
						class="aspect-square rounded-sm flex flex-col items-center justify-end p-2 text-[10px] font-mono border border-neutral-200"
						:class="`bg-primary-${stop}`"
						:style="getDynamicTextColor(stop)"
					>
						<span class="font-semibold">{{ stop }}</span>
					</div>
				</div>
			</div>

			<!-- Component Examples -->
			<div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Buttons -->
				<div class="p-4 border border-neutral-200 rounded-lg">
					<h3 class="text-sm font-semibold mb-3">Buttons using primary-{shade}</h3>
					<div class="flex flex-wrap gap-2">
						<button
							v-for="stop in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]"
							:key="`btn-${stop}`"
							:class="`bg-primary-${stop} text-${stop > 500 ? 'white' : 'primary-900'} px-3 py-1.5 rounded-sm text-xs font-medium`"
						>
							{{ stop }}
						</button>
					</div>
				</div>

				<!-- Text Colors -->
				<div class="p-4 border border-neutral-200 rounded-lg">
					<h3 class="text-sm font-semibold mb-3">Text using text-primary-{shade}</h3>
					<div class="space-y-1">
						<p
							v-for="stop in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]"
							:key="`text-${stop}`"
							:class="`text-primary-${stop} text-sm font-medium`"
						>
							primary-{{ stop }} — The quick brown fox jumps over the lazy dog
						</p>
					</div>
				</div>

				<!-- Borders -->
				<div class="p-4 border border-neutral-200 rounded-lg">
					<h3 class="text-sm font-semibold mb-3">Borders using border-primary-{shade}</h3>
					<div class="grid grid-cols-5 gap-2">
						<div
							v-for="stop in [100, 300, 500, 700, 900]"
							:key="`border-${stop}`"
							:class="`border-2 border-primary-${stop} p-2 rounded-sm text-center text-xs`"
						>
							{{ stop }}
						</div>
					</div>
				</div>

				<!-- Backgrounds with text contrast -->
				<div class="p-4 border border-neutral-200 rounded-lg">
					<h3 class="text-sm font-semibold mb-3">Backgrounds with contrast text</h3>
					<div class="space-y-2">
						<div
							v-for="stop in [50, 200, 500, 800]"
							:key="`bg-${stop}`"
							:class="`bg-primary-${stop} p-3 rounded-sm`"
							:style="getDynamicTextColor(stop)"
						>
							<div class="font-mono text-xs opacity-70">bg-primary-{{ stop }}</div>
							<div class="font-semibold">Background with auto-contrast text</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Live computed primary values -->
		<div class="mt-10">
			<h2 class="text-lg font-semibold mb-3">Current CSS Variable Values</h2>
			<p class="text-sm text-neutral-600 mb-4">
				Live readout of the actual <code>--color-primary-*</code> CSS variables on <code>:root</code>.
				Updates when you click <strong>Apply to App</strong>.
			</p>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
				<div
					v-for="stop in stops"
					:key="`var-${stop}`"
					class="border border-neutral-200 rounded-sm p-3"
				>
					<div class="flex items-center gap-2 mb-1">
						<div
							class="w-6 h-6 rounded-sm border border-neutral-200"
							:style="{ backgroundColor: getCssVar(`--color-primary-${stop}`) }"
						></div>
						<span class="text-xs font-mono font-semibold">--color-primary-{{ stop }}</span>
					</div>
					<code class="text-[10px] text-neutral-600 break-all">
						{{ getCssVar(`--color-primary-${stop}`) || '(default)' }}
					</code>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Input } from '../../lib/components/input'
import { Button } from '../../lib/components/button'
import { generatePrimaryShades, generateOklchConstHueShades, generateOklchDeltaShades, generateHslShades, generateLabShades, useColorTheme, invalidateReferenceCache } from '../composables/useColorTheme'
import { readPaletteFromCss, FALLBACK_PRIMARY_PALETTE, type RGB } from '../../lib/utils/chromajs'
// @ts-nocheck: chroma-js has no built-in TypeScript declarations
import chroma from 'chroma-js'

const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
const presetColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

const inputColor = ref<string>('#3b82f6')

// Tailwind blue-500 reference palette (extracted from tailwind.config / tailwind.css)
const tailwindBlue500: [number, number, number][] = [
	[239, 246, 255], // 50
	[219, 234, 254], // 100
	[191, 219, 254], // 200
	[147, 197, 253], // 300
	[96, 165, 250],  // 400
	[59, 130, 246],  // 500
	[37, 99, 235],   // 600
	[29, 78, 216],   // 700
	[30, 64, 175],   // 800
	[30, 58, 138],   // 900
	[23, 37, 84],    // 950
]

// Primary palette (extracted from lib/config/tailwind.css) for delta approach
const primaryPalette: [number, number, number][] = [
	[234, 237, 255], // 50
	[212, 219, 254], // 100
	[167, 185, 254], // 200
	[122, 153, 253], // 300
	[53, 119, 253],  // 400
	[11, 90, 208],   // 500
	[7, 72, 169],    // 600
	[4, 55, 133],    // 700
	[2, 36, 94],     // 800
	[1, 21, 61],     // 900
	[0, 12, 42],     // 950
]

// Approach A: Lab Scale (Primary CP + HSL transform)
const labShades = computed<[number, number, number][]>(() => {
	try {
		const palette = readPaletteFromCss('--color-primary') || FALLBACK_PRIMARY_PALETTE
		return generateLabShades({ input: inputColor.value, reference: palette as readonly RGB[] })
	} catch {
		return Array(11).fill([0, 0, 0]) as [number, number, number][]
	}
})

// Approach B: Pure Delta RGB (apply primary deltas to user color)
const deltaShades = computed<[number, number, number][]>(() => {
	try {
		const baseRgb = chroma(inputColor.value).rgb() as [number, number, number]
		const [baseR, baseG, baseB] = baseRgb
		// Find index of shade closest to user color's lightness, use it as anchor
		const userL = chroma(inputColor.value).get('hsl.l')
		const primaryL = primaryPalette.map((c) => {
			const [r, g, b] = c
			return chroma.rgb(r, g, b).get('hsl.l')
		})
		let anchorIdx = 0
		let minDiff = Infinity
		for (let i = 0; i < primaryL.length; i++) {
			const diff = Math.abs(primaryL[i] - userL)
			if (diff < minDiff) {
				minDiff = diff
				anchorIdx = i
			}
		}
		// Calculate deltas from anchor
		const [anchorR, anchorG, anchorB] = primaryPalette[anchorIdx]
		return primaryPalette.map(([r, g, b]) => {
			const dr = r - anchorR
			const dg = g - anchorG
			const db = b - anchorB
			return [
				Math.max(0, Math.min(255, baseR + dr)),
				Math.max(0, Math.min(255, baseG + dg)),
				Math.max(0, Math.min(255, baseB + db)),
			] as [number, number, number]
		})
	} catch {
		return Array(11).fill([0, 0, 0]) as [number, number, number][]
	}
})

// Approach C: HSL Lightness Curve
const hslShades = computed<[number, number, number][]>(() => {
	try {
		return generateHslShades(inputColor.value)
	} catch {
		return Array(11).fill([0, 0, 0]) as [number, number, number][]
	}
})

// Approach D: OKLCH Lightness + Chroma Curve (no H shift)
const oklchShades = computed<[number, number, number][]>(() => {
	try {
		return generateOklchConstHueShades(inputColor.value)
	} catch {
		return Array(11).fill([0, 0, 0]) as [number, number, number][]
	}
})

// Approach E: OKLCH L + C + H shift (Recommended, full designer curve)
const oklchHueShades = computed<[number, number, number][]>(() => {
	try {
		return generatePrimaryShades(inputColor.value)
	} catch {
		return Array(11).fill([0, 0, 0]) as [number, number, number][]
	}
})

// Approach F: OKLCH Delta (cumulative steps from anchor)
const oklchDeltaShades = computed<[number, number, number][]>(() => {
	try {
		return generateOklchDeltaShades(inputColor.value)
	} catch {
		return Array(11).fill([0, 0, 0]) as [number, number, number][]
	}
})

// Apply to app theme
function applyTheme() {
	invalidateReferenceCache() // re-read primary palette from CSS
	useColorTheme(inputColor.value)
}

function resetTheme() {
	inputColor.value = '#3b82f6'
	document.documentElement.style.removeProperty('--color-primary-50')
	document.documentElement.style.removeProperty('--color-primary-100')
	document.documentElement.style.removeProperty('--color-primary-200')
	document.documentElement.style.removeProperty('--color-primary-300')
	document.documentElement.style.removeProperty('--color-primary-400')
	document.documentElement.style.removeProperty('--color-primary-500')
	document.documentElement.style.removeProperty('--color-primary-600')
	document.documentElement.style.removeProperty('--color-primary-700')
	document.documentElement.style.removeProperty('--color-primary-800')
	document.documentElement.style.removeProperty('--color-primary-900')
	document.documentElement.style.removeProperty('--color-primary-950')
}

// Watch for changes
watch(inputColor, () => {
	// Auto-apply on change
	applyTheme()
})

// Helper: read computed CSS variable value
function getCssVar(name: string): string {
	if (typeof document === 'undefined') return ''
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// Helper: determine text color (black/white) for proper contrast on a bg shade
function getDynamicTextColor(stop: number) {
	// Light shades (50-300) -> dark text
	// Mid shades (400-500) -> either (use white for darker)
	// Dark shades (600-950) -> white text
	const textColor = stop >= 500 ? '#ffffff' : '#0a0a0a'
	return { color: textColor }
}

// Helper: text color for a specific RGB shade (used in comparison table)
function getContrastColorForShade(rgb: [number, number, number]): string {
	const [r, g, b] = rgb
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
	return luminance > 0.5 ? '#0a0a0a' : '#ffffff'
}

// Helper: chroma.deltaE expects ChromaInput, not plain arrays.
// Use chroma.rgb(r, g, b) to convert to Color which satisfies the type.
function deltaE(a: [number, number, number], b: [number, number, number]): number {
	return chroma.deltaE(chroma.rgb(...a), chroma.rgb(...b))
}

// Compute Delta-E distances between each method and Tailwind reference
const labDistances = computed<number[]>(() => {
	return labShades.value.map((shade, i) => {
		try {
			return deltaE(shade, tailwindBlue500[i])
		} catch {
			return 999
		}
	})
})

const deltaDistances = computed<number[]>(() => {
	return deltaShades.value.map((shade, i) => {
		try {
			return deltaE(shade, tailwindBlue500[i])
		} catch {
			return 999
		}
	})
})

const hslDistances = computed<number[]>(() => {
	return hslShades.value.map((shade, i) => {
		try {
			return deltaE(shade, tailwindBlue500[i])
		} catch {
			return 999
		}
	})
})

const oklchDistances = computed<number[]>(() => {
	return oklchShades.value.map((shade, i) => {
		try {
			return deltaE(shade, tailwindBlue500[i])
		} catch {
			return 999
		}
	})
})

const oklchHueDistances = computed<number[]>(() => {
	return oklchHueShades.value.map((shade, i) => {
		try {
			return deltaE(shade, tailwindBlue500[i])
		} catch {
			return 999
		}
	})
})

const oklchDeltaDistances = computed<number[]>(() => {
	return oklchDeltaShades.value.map((shade, i) => {
		try {
			return deltaE(shade, tailwindBlue500[i])
		} catch {
			return 999
		}
	})
})

const avgLab = computed(() => avg(labDistances.value))
const avgDelta = computed(() => avg(deltaDistances.value))
const avgHsl = computed(() => avg(hslDistances.value))
const avgOklch = computed(() => avg(oklchDistances.value))
const avgOklchHue = computed(() => avg(oklchHueDistances.value))
const avgOklchDelta = computed(() => avg(oklchDeltaDistances.value))

function avg(arr: number[]): number {
	return arr.reduce((s, n) => s + n, 0) / arr.length
}

// Color scale for distance cells (green = good, red = bad)
function getDistanceColor(d: number): string {
	if (d < 1) return 'rgba(34, 197, 94, 0.15)'   // excellent
	if (d < 3) return 'rgba(34, 197, 94, 0.08)'   // good
	if (d < 6) return 'rgba(234, 179, 8, 0.15)'   // ok
	if (d < 10) return 'rgba(234, 179, 8, 0.25)'  // poor
	return 'rgba(239, 68, 68, 0.2)'               // bad
}
</script>

<style scoped>
table {
	border: 1px solid rgb(212 212 212);
}
th,
td {
	border-right: 1px solid rgb(245 245 245);
}
</style>
