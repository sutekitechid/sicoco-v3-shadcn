<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import { Dropdown } from '../../dropdown'
import Tooltip from '../../tooltip/Tooltip.vue'
import TooltipContent from '../../tooltip/TooltipContent.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuillInstance = any

const props = defineProps<{
	quill: QuillInstance | null
	disabled?: boolean
}>()

type Swatch = {
	key: string
	family: string
	shade: string
	class: string
	value: string
	checkClass?: string
}

type ColorGroup = {
	label: string
	family: string
	swatches: Swatch[]
}

const currentColor = ref<string>('')
const customColor = ref<string>('#000000')
const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null)
const groupRefs = ref<Record<string, HTMLElement | null>>({})

const SWATCH_DEFS: { family: string; shade: string; class: string; checkClass: string }[] = [
	{ family: 'primary', shade: '50', class: '!bg-primary-50', checkClass: 'text-neutral-950' },
	{ family: 'primary', shade: '100', class: '!bg-primary-100', checkClass: 'text-neutral-950' },
	{ family: 'primary', shade: '200', class: '!bg-primary-200', checkClass: 'text-neutral-950' },
	{ family: 'primary', shade: '300', class: '!bg-primary-300', checkClass: 'text-white' },
	{ family: 'primary', shade: '400', class: '!bg-primary-400', checkClass: 'text-white' },
	{ family: 'primary', shade: '500', class: '!bg-primary-500', checkClass: 'text-white' },
	{ family: 'primary', shade: '600', class: '!bg-primary-600', checkClass: 'text-white' },
	{ family: 'primary', shade: '700', class: '!bg-primary-700', checkClass: 'text-white' },
	{ family: 'primary', shade: '800', class: '!bg-primary-800', checkClass: 'text-white' },
	{ family: 'primary', shade: '900', class: '!bg-primary-900', checkClass: 'text-white' },
	{ family: 'primary', shade: '950', class: '!bg-primary-950', checkClass: 'text-white' },
	{ family: 'secondary', shade: '50', class: '!bg-secondary-50', checkClass: 'text-neutral-950' },
	{ family: 'secondary', shade: '100', class: '!bg-secondary-100', checkClass: 'text-neutral-950' },
	{ family: 'secondary', shade: '200', class: '!bg-secondary-200', checkClass: 'text-neutral-950' },
	{ family: 'secondary', shade: '300', class: '!bg-secondary-300', checkClass: 'text-neutral-950' },
	{ family: 'secondary', shade: '400', class: '!bg-secondary-400', checkClass: 'text-white' },
	{ family: 'secondary', shade: '500', class: '!bg-secondary-500', checkClass: 'text-white' },
	{ family: 'secondary', shade: '600', class: '!bg-secondary-600', checkClass: 'text-white' },
	{ family: 'secondary', shade: '700', class: '!bg-secondary-700', checkClass: 'text-white' },
	{ family: 'secondary', shade: '800', class: '!bg-secondary-800', checkClass: 'text-white' },
	{ family: 'secondary', shade: '900', class: '!bg-secondary-900', checkClass: 'text-white' },
	{ family: 'secondary', shade: '950', class: '!bg-secondary-950', checkClass: 'text-white' },
	{ family: 'warning', shade: '50', class: '!bg-warning-50', checkClass: 'text-neutral-950' },
	{ family: 'warning', shade: '100', class: '!bg-warning-100', checkClass: 'text-neutral-950' },
	{ family: 'warning', shade: '200', class: '!bg-warning-200', checkClass: 'text-neutral-950' },
	{ family: 'warning', shade: '300', class: '!bg-warning-300', checkClass: 'text-neutral-950' },
	{ family: 'warning', shade: '400', class: '!bg-warning-400', checkClass: 'text-neutral-950' },
	{ family: 'warning', shade: '500', class: '!bg-warning-500', checkClass: 'text-neutral-950' },
	{ family: 'warning', shade: '600', class: '!bg-warning-600', checkClass: 'text-white' },
	{ family: 'warning', shade: '700', class: '!bg-warning-700', checkClass: 'text-white' },
	{ family: 'warning', shade: '800', class: '!bg-warning-800', checkClass: 'text-white' },
	{ family: 'warning', shade: '900', class: '!bg-warning-900', checkClass: 'text-white' },
	{ family: 'warning', shade: '950', class: '!bg-warning-950', checkClass: 'text-white' },
	{ family: 'success', shade: '50', class: '!bg-success-50', checkClass: 'text-neutral-950' },
	{ family: 'success', shade: '100', class: '!bg-success-100', checkClass: 'text-neutral-950' },
	{ family: 'success', shade: '200', class: '!bg-success-200', checkClass: 'text-neutral-950' },
	{ family: 'success', shade: '300', class: '!bg-success-300', checkClass: 'text-neutral-950' },
	{ family: 'success', shade: '400', class: '!bg-success-400', checkClass: 'text-white' },
	{ family: 'success', shade: '500', class: '!bg-success-500', checkClass: 'text-white' },
	{ family: 'success', shade: '600', class: '!bg-success-600', checkClass: 'text-white' },
	{ family: 'success', shade: '700', class: '!bg-success-700', checkClass: 'text-white' },
	{ family: 'success', shade: '800', class: '!bg-success-800', checkClass: 'text-white' },
	{ family: 'success', shade: '900', class: '!bg-success-900', checkClass: 'text-white' },
	{ family: 'success', shade: '950', class: '!bg-success-950', checkClass: 'text-white' },
	{ family: 'danger', shade: '50', class: '!bg-danger-50', checkClass: 'text-neutral-950' },
	{ family: 'danger', shade: '100', class: '!bg-danger-100', checkClass: 'text-neutral-950' },
	{ family: 'danger', shade: '200', class: '!bg-danger-200', checkClass: 'text-neutral-950' },
	{ family: 'danger', shade: '300', class: '!bg-danger-300', checkClass: 'text-white' },
	{ family: 'danger', shade: '400', class: '!bg-danger-400', checkClass: 'text-white' },
	{ family: 'danger', shade: '500', class: '!bg-danger-500', checkClass: 'text-white' },
	{ family: 'danger', shade: '600', class: '!bg-danger-600', checkClass: 'text-white' },
	{ family: 'danger', shade: '700', class: '!bg-danger-700', checkClass: 'text-white' },
	{ family: 'danger', shade: '800', class: '!bg-danger-800', checkClass: 'text-white' },
	{ family: 'danger', shade: '900', class: '!bg-danger-900', checkClass: 'text-white' },
	{ family: 'danger', shade: '950', class: '!bg-danger-950', checkClass: 'text-white' },
	{ family: 'info', shade: '50', class: '!bg-info-50', checkClass: 'text-neutral-950' },
	{ family: 'info', shade: '100', class: '!bg-info-100', checkClass: 'text-neutral-950' },
	{ family: 'info', shade: '200', class: '!bg-info-200', checkClass: 'text-neutral-950' },
	{ family: 'info', shade: '300', class: '!bg-info-300', checkClass: 'text-white' },
	{ family: 'info', shade: '400', class: '!bg-info-400', checkClass: 'text-white' },
	{ family: 'info', shade: '500', class: '!bg-info-500', checkClass: 'text-white' },
	{ family: 'info', shade: '600', class: '!bg-info-600', checkClass: 'text-white' },
	{ family: 'info', shade: '700', class: '!bg-info-700', checkClass: 'text-white' },
	{ family: 'info', shade: '800', class: '!bg-info-800', checkClass: 'text-white' },
	{ family: 'info', shade: '900', class: '!bg-info-900', checkClass: 'text-white' },
	{ family: 'info', shade: '950', class: '!bg-info-950', checkClass: 'text-white' },
	{ family: 'orange', shade: '50', class: '!bg-orange-50', checkClass: 'text-neutral-950' },
	{ family: 'orange', shade: '100', class: '!bg-orange-100', checkClass: 'text-neutral-950' },
	{ family: 'orange', shade: '200', class: '!bg-orange-200', checkClass: 'text-neutral-950' },
	{ family: 'orange', shade: '300', class: '!bg-orange-300', checkClass: 'text-neutral-950' },
	{ family: 'orange', shade: '400', class: '!bg-orange-400', checkClass: 'text-white' },
	{ family: 'orange', shade: '500', class: '!bg-orange-500', checkClass: 'text-white' },
	{ family: 'orange', shade: '600', class: '!bg-orange-600', checkClass: 'text-white' },
	{ family: 'orange', shade: '700', class: '!bg-orange-700', checkClass: 'text-white' },
	{ family: 'orange', shade: '800', class: '!bg-orange-800', checkClass: 'text-white' },
	{ family: 'orange', shade: '900', class: '!bg-orange-900', checkClass: 'text-white' },
	{ family: 'orange', shade: '950', class: '!bg-orange-950', checkClass: 'text-white' },
	{ family: 'neutral', shade: '50', class: '!bg-neutral-50', checkClass: 'text-neutral-950' },
	{ family: 'neutral', shade: '100', class: '!bg-neutral-100', checkClass: 'text-neutral-950' },
	{ family: 'neutral', shade: '200', class: '!bg-neutral-200', checkClass: 'text-neutral-950' },
	{ family: 'neutral', shade: '300', class: '!bg-neutral-300', checkClass: 'text-neutral-950' },
	{ family: 'neutral', shade: '400', class: '!bg-neutral-400', checkClass: 'text-neutral-950' },
	{ family: 'neutral', shade: '500', class: '!bg-neutral-500', checkClass: 'text-white' },
	{ family: 'neutral', shade: '600', class: '!bg-neutral-600', checkClass: 'text-white' },
	{ family: 'neutral', shade: '700', class: '!bg-neutral-700', checkClass: 'text-white' },
	{ family: 'neutral', shade: '800', class: '!bg-neutral-800', checkClass: 'text-white' },
	{ family: 'neutral', shade: '900', class: '!bg-neutral-900', checkClass: 'text-white' },
	{ family: 'neutral', shade: '950', class: '!bg-neutral-950', checkClass: 'text-white' },
]

const FAMILIES: { family: string; label: string }[] = [
	{ family: 'primary', label: 'Primary' },
	{ family: 'secondary', label: 'Secondary' },
	{ family: 'warning', label: 'Warning' },
	{ family: 'success', label: 'Success' },
	{ family: 'danger', label: 'Danger' },
	{ family: 'info', label: 'Info' },
	{ family: 'orange', label: 'Orange' },
	{ family: 'neutral', label: 'Neutral' },
]

const WHITE_SWATCH: Swatch = {
	key: 'extra-white',
	family: 'extra',
	shade: 'white',
	class: 'bg-white',
	value: '#ffffff',
	checkClass: 'text-neutral-950',
}

const BLACK_SWATCH: Swatch = {
	key: 'extra-black',
	family: 'extra',
	shade: 'black',
	class: 'bg-black',
	value: '#000000',
	checkClass: 'text-white',
}

const colorGroups = ref<ColorGroup[]>([])

function readCssVar(name: string): string {
	if (typeof window === 'undefined') return ''
	return getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim()
}

function rgbTripletToHex(triplet: string): string {
	return (
		'#' +
		triplet
			.trim()
			.split(/\s+/)
			.map(n => Number(n).toString(16).padStart(2, '0'))
			.join('')
	)
}

function buildGroups(): ColorGroup[] {
	return FAMILIES.map(group => ({
		label: group.label,
		family: group.family,
		swatches: SWATCH_DEFS.filter(s => s.family === group.family).map(s => {
			const raw = readCssVar(`--color-${s.family}-${s.shade}`)
			return {
				key: `${s.family}-${s.shade}`,
				family: s.family,
				shade: s.shade,
				class: s.class,
				value: raw ? rgbTripletToHex(raw) : '',
				checkClass: s.checkClass,
			}
		}),
	}))
}

function normalizeColor(color: string): string {
	return (color || '').replace(/\s+/g, '').toLowerCase()
}

function toHex(color: string): string | null {
	if (!color) return null
	const trimmed = color.trim().toLowerCase()
	if (trimmed.startsWith('#')) {
		return trimmed.length === 7 ? trimmed : null
	}
	const match = trimmed.match(
		/rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)/,
	)
	if (!match) return null
	return (
		'#' +
		[match[1], match[2], match[3]]
			.map(n => Number(n).toString(16).padStart(2, '0'))
			.join('')
	)
}

function isActive(swatch: Swatch): boolean {
	if (swatch.key === 'extra-default') {
		return !currentColor.value
	}
	return normalizeColor(currentColor.value) === normalizeColor(swatch.value)
}

function findActiveGroupKey(color: string): string | null {
	if (!color) return null
	const norm = normalizeColor(color)
	for (const group of colorGroups.value) {
		for (const swatch of group.swatches) {
			if (normalizeColor(swatch.value) === norm) return group.family
		}
	}
	if (norm === normalizeColor(WHITE_SWATCH.value)) return 'default'
	if (norm === normalizeColor(BLACK_SWATCH.value)) return 'default'
	return null
}

function setGroupRef(key: string) {
	return (el: Element | null) => {
		groupRefs.value[key] = el as HTMLElement | null
	}
}

function setScrollContainerRef(el: Element | null) {
	if (!el) return
	nextTick(() => {
		const key = findActiveGroupKey(currentColor.value)
		if (!key) return
		const target = groupRefs.value[key]
		if (!target) return
		target.scrollIntoView({ block: 'nearest' })
	})
}

function handleSelect(value: string) {
	props.quill?.format?.('color', value || false, 'user')
	currentColor.value = value
	dropdownRef.value?.closeDropdown?.()
	props.quill?.focus?.()
}

function handleCustomColor(event: Event) {
	const input = event.target as HTMLInputElement
	const value = input.value
	if (!value) return
	customColor.value = value
	handleSelect(value)
}

let selectionHandler: ((range: unknown) => void) | null = null

watch(
	() => props.quill,
	(newQuill, oldQuill) => {
		if (oldQuill && selectionHandler) {
			oldQuill.off?.('selection-change', selectionHandler)
		}
		if (newQuill) {
			selectionHandler = (range: unknown) => {
				if (!range) {
					currentColor.value = ''
					return
				}
				const format = newQuill.getFormat?.(range) as
					| { color?: string }
					| undefined
				currentColor.value = format?.color ?? ''
			}
			newQuill.on?.('selection-change', selectionHandler)
		}
	},
	{ immediate: true },
)

watch(currentColor, newColor => {
	if (!newColor) {
		customColor.value = '#000000'
		return
	}
	const hex = toHex(newColor)
	if (hex) customColor.value = hex
})

if (typeof window !== 'undefined') {
	colorGroups.value = buildGroups()
}

onUnmounted(() => {
	if (props.quill && selectionHandler) {
		props.quill.off?.('selection-change', selectionHandler)
	}
})
</script>

<template>
	<Dropdown ref="dropdownRef" :disabled="disabled" :scrollable="false">
		<template #trigger>
			<Tooltip trigger="hover">
				<template #trigger>
					<div class="ql-color flex items-center gap-1 relative">
						<i class="si-rt-text-color text-title-sm"></i>
						<div
							class="h-1 w-4 rounded-full absolute bottom-0.5 inset-x-0.5 bg-neutral-950 dark:bg-neutral-500"
							:style="[`backgroundColor: ${currentColor}`]"
						></div>
						<i class="si-heroicon-outline-chevron-down text-label-sm"></i>
					</div>
				</template>
				<TooltipContent variant="black">Text Color</TooltipContent>
			</Tooltip>
		</template>

		<div
			:ref="setScrollContainerRef"
			class="p-2 w-64 max-h-80 overflow-y-auto flex flex-col gap-2"
		>
			<label class="border-t border-neutral-200 pt-2 block cursor-pointer" @click.stop>
				<div class="text-[10px] uppercase tracking-wide text-neutral-600 mb-1">
					Custom Color
				</div>
				<div class="flex items-center gap-2">
					<input
						type="color"
						:value="customColor"
						aria-label="Custom color picker"
						class="sr-only"
						@change="handleCustomColor"
					/>
					<div
						class="w-7 h-7 rounded border border-neutral-300"
						:style="{ backgroundColor: customColor }"
					></div>
					<span class="text-[10px] text-neutral-600 font-mono truncate">
						{{ customColor }}
					</span>
				</div>
			</label>
			<div
				v-for="group in colorGroups"
				:key="group.family"
				:ref="setGroupRef(group.family)"
			>
				<div class="text-[10px] uppercase tracking-wide text-neutral-600 mb-1">
					{{ group.label }}
				</div>
				<div class="grid grid-cols-11 gap-1">
					<Tooltip
						v-for="swatch in group.swatches"
						:key="swatch.key"
						trigger="hover"
					>
						<template #trigger>
							<button
								type="button"
								:aria-label="swatch.key"
								class="rounded border-neutral-300 cursor-pointer"
								@click="handleSelect(swatch.value)"
							>
								<div
									:class="[
										'w-4 h-4 rounded relative flex items-center justify-center',
										swatch.class,
										isActive(swatch) &&
											'ring-2 ring-primary-500 ring-offset-1',
									]"
								>
									<i
										v-if="isActive(swatch)"
										class="si-heroicon-solid-check text-[10px]"
										:class="swatch.checkClass"
									/>
								</div>
							</button>
						</template>
						<TooltipContent variant="black">
							{{ swatch.key }}
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	</Dropdown>
</template>
