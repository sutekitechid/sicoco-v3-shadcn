<template>
	<Primitive :as="as" :as-child="asChild" :class="cn(props.class)">
		<slot :filters="filters" :dirty="dirty" :show-reset="showReset" :apply="onApply" :reset="onReset" />
	</Primitive>
</template>

<script setup lang="ts">
import { ref, computed, watch, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'

interface Props extends PrimitiveProps {
	initialFilter: Record<string, unknown>
	currentFilter?: Record<string, unknown>
	class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
	as: 'div',
	currentFilter: () => ({}),
})

const emit = defineEmits<{
	'update:dirty': [value: boolean]
	'update:applied': [value: boolean]
	apply: [filters: Record<string, unknown>]
	reset: []
}>()

const source = computed(() => {
	return Object.keys(props.currentFilter).length
		? props.currentFilter
		: props.initialFilter
})

function toDayKey(value: unknown): string | null {
	if (typeof value !== 'string' || value === '') return null
	const date = new Date(value)
	if (isNaN(date.getTime())) return null
	return date.toISOString().slice(0, 10)
}

function normalizeDates(value: unknown): unknown {
	const dayKey = toDayKey(value)
	if (dayKey) return dayKey
	if (Array.isArray(value)) return value.map(normalizeDates)
	if (value !== null && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, val]) => [key, normalizeDates(val)])
		)
	}
	return value
}

function dateAwareIsEqual(a: unknown, b: unknown): boolean {
	return isEqual(normalizeDates(a), normalizeDates(b))
}

function differsFromInitial(snapshotted: Record<string, unknown>) {
	return Object.keys(props.initialFilter).some(
		(key) =>
			!dateAwareIsEqual(snapshotted[key], (props.initialFilter as Record<string, unknown>)[key])
	)
}

const filters = ref(cloneDeep(source.value))
const lastApplied = ref(cloneDeep(source.value))
const applied = ref(false)

const dirty = computed(() => !dateAwareIsEqual(filters.value, lastApplied.value))
const showReset = computed(() => differsFromInitial(lastApplied.value))

watch(dirty, (val) => {
	emit('update:dirty', val)
})

watch(applied, (val) => {
	emit('update:applied', val)
})

let suppressLastAppliedSync = false

watch(
	() => props.currentFilter,
	(val) => {
		if (!val || Object.keys(val).length === 0) {
			filters.value = cloneDeep(props.initialFilter)
			if (!suppressLastAppliedSync) {
				lastApplied.value = cloneDeep(props.initialFilter)
			}
			return
		}
		filters.value = cloneDeep(val)
		if (!suppressLastAppliedSync) {
			lastApplied.value = cloneDeep(val)
		}
	},
	{ deep: true }
)

function onApply() {
	suppressLastAppliedSync = true
	lastApplied.value = cloneDeep(filters.value)
	applied.value = true
	emit('apply', filters.value)
}

function onReset() {
	suppressLastAppliedSync = false
	filters.value = cloneDeep(props.initialFilter)
	lastApplied.value = cloneDeep(props.initialFilter)
	applied.value = false
	emit('reset')
}

function setInitial(values: Record<string, unknown>) {
	suppressLastAppliedSync = false
	filters.value = cloneDeep(values)
	lastApplied.value = cloneDeep(values)
	applied.value = false
}

defineExpose({
	filters,
	dirty,
	applied,
	showReset,
	onApply,
	onReset,
	setInitial,
})
</script>
