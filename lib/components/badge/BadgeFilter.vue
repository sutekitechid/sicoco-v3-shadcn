<script setup lang="ts">
/**
 * BadgeFilter is a clickable filter badge used to toggle filter states.
 *
 * It wraps the base Badge component to inherit consistent typography and
 * border-radius, while layering filter-specific visuals:
 * - default: transparent background with neutral border
 * - selected: secondary border and subtle background
 * - inactive: neutral muted styling (disabled)
 *
 * Optionally displays a numeric counter on the right side.
 *
 * Supports `v-model` for single-select scenarios: the parent holds the
 * currently selected value (string or null) and each BadgeFilter reflects
 * whether `modelValue === value`. When `modelValue` is left undefined the
 * component falls back to an internal toggle (uncontrolled mode).
 *
 * @component
 * @example
 * <!-- uncontrolled -->
 * <BadgeFilter value="category" :count="3">Category</BadgeFilter>
 *
 * <!-- v-model single-select -->
 * <BadgeFilter v-model="selected" value="category">Category</BadgeFilter>
 */
import { computed, ref, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { badgeFilterCounterVariants, badgeFilterVariants } from './index'
import Badge from './Badge.vue'

interface Props {
	/** When true, renders the disabled visual state and blocks interaction. */
	inactive?: boolean
	/** Whether to render the numeric counter when `count` is provided. */
	number?: boolean
	/** The numeric value rendered inside the counter (e.g. result count). */
	count?: string | number
	/** Identifier used for both the `click` emit and the `v-model` match. */
	value?: string
	/** Controlled selected value for `v-model`. `null` means none selected. */
	modelValue?: string | null
	/** Additional utility classes merged via `cn()`. */
	class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
	inactive: false,
	number: true,
	value: '',
	modelValue: undefined,
})

const emit = defineEmits<{
	click: [value: string]
	'update:modelValue': [value: string | null]
}>()

/** Fallback toggle state used when `modelValue` is not provided (uncontrolled). */
const internalSelected = ref(false)

/** True when the component is in controlled mode (i.e. `v-model` is bound). */
const isControlled = computed(() => props.modelValue !== undefined)

const isSelected = computed(() => {
	if (isControlled.value) {
		return props.modelValue === props.value
	}
	return internalSelected.value
})

function handleClick() {
	if (props.inactive) return

	if (isControlled.value) {
		const next: string | null = isSelected.value ? null : props.value
		emit('update:modelValue', next)
	} else {
		internalSelected.value = !internalSelected.value
	}

	emit('click', props.value)
}

const visualState = computed<'inactive' | 'selected' | 'default'>(() => {
	if (props.inactive) return 'inactive'
	if (isSelected.value) return 'selected'
	return 'default'
})

const showCounter = computed(() => {
	if (!props.number) return false
	if (props.count === undefined || props.count === null) return false
	return String(props.count).length > 0
})

const counterDisplay = computed(() => {
	if (typeof props.count === 'number') return String(props.count)
	return props.count ?? ''
})

const wrapperClass = computed(() =>
	cn(
		'inline-flex bg-transparent border-0 p-0 m-0 cursor-pointer ' +
			'focus:outline-hidden focus-visible:outline-2 focus-visible:outline-secondary-500 ' +
			'focus-visible:outline-offset-2 rounded-full',
		props.inactive && 'cursor-not-allowed',
		props.class,
	),
)

const badgeClass = computed(() =>
	cn(badgeFilterVariants({ state: visualState.value })),
)

const counterClass = computed(() =>
	cn(badgeFilterCounterVariants({ state: visualState.value })),
)
</script>

<template>
	<button
		type="button"
		:disabled="inactive"
		:aria-pressed="!inactive ? isSelected : undefined"
		:aria-disabled="inactive"
		data-cy="badge-filter"
		:class="wrapperClass"
		@click="handleClick"
	>
		<Badge
			:class="badgeClass"
			rounded
		>
			<slot />
			<span
				v-if="showCounter"
				data-cy="badge-filter-counter"
				:class="counterClass"
			>
				{{ counterDisplay }}
			</span>
		</Badge>
	</button>
</template>
