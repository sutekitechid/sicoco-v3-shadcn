import { describe, it, expect } from 'vitest'
import { extractVueApi, extractDescription } from '../../src/parsers/vue-api-extractor.js'

const SAMPLE_BUTTON = `<script setup lang="ts">
/**
 * Button component with multiple variants.
 */
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props {
  /** The visual variant of the button. */
  variant?: 'primary' | 'danger'
  /** The size of the button. */
  size?: 'sm' | 'md' | 'lg'
  class?: HTMLAttributes['class']
  /** Whether the button is rounded. */
  rounded?: boolean
  /** Whether the button is outlined. */
  outlined?: boolean
  /** Whether the button is disabled. */
  disabled?: boolean
}

const props = defineProps<Props>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
`

describe('extractVueApi', () => {
	it('extracts props with types, required flag, and JSDoc descriptions', () => {
		const { props } = extractVueApi(SAMPLE_BUTTON)
		expect(props.length).toBeGreaterThan(0)

		const variant = props.find((p) => p.name === 'variant')
		expect(variant).toBeDefined()
		expect(variant?.type).toContain('primary')
		expect(variant?.required).toBe(false)
		expect(variant?.description).toContain('visual variant')
	})

	it('extracts emits with payload type', () => {
		const { emits } = extractVueApi(SAMPLE_BUTTON)
		const click = emits.find((e) => e.name === 'click')
		expect(click).toBeDefined()
		expect(click?.payload).toContain('MouseEvent')
	})

	it('returns empty arrays for files without <script setup>', () => {
		const { props, emits, slots } = extractVueApi(
			'<template><div>hi</div></template>',
		)
		expect(props).toEqual([])
		expect(emits).toEqual([])
		expect(slots).toEqual([])
	})

	it('handles defineSlots with scoped bindings', () => {
		const src = `<script setup lang="ts">
defineSlots<{
  default?: (props: { row: unknown; index: number }) => unknown
  footer?: () => unknown
}>()
</script>`
		const { slots } = extractVueApi(src)
		const def = slots.find((s) => s.name === 'default')
		expect(def).toBeDefined()
		expect(def?.scope).toEqual(['row', 'index'])
		const footer = slots.find((s) => s.name === 'footer')
		expect(footer?.scope).toBeUndefined()
	})

	it('applies withDefaults defaults to prop metadata', () => {
		const src = `<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md'
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
})
</script>`
		const { props } = extractVueApi(src)
		const size = props.find((p) => p.name === 'size')
		expect(size?.default).toBe("'md'")
		const disabled = props.find((p) => p.name === 'disabled')
		expect(disabled?.default).toBe('false')
	})

	it('marks optional props as not required', () => {
		const { props } = extractVueApi(SAMPLE_BUTTON)
		const rounded = props.find((p) => p.name === 'rounded')
		expect(rounded?.required).toBe(false)
	})
})

describe('extractDescription', () => {
	it('returns the JSDoc summary without tag lines', () => {
		const desc = extractDescription(SAMPLE_BUTTON)
		expect(desc).toContain('Button component')
		expect(desc).not.toContain('@example')
	})
})
