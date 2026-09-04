<template>
	<div>
		<slot :filters="filters" :dirty="dirty" :apply="onApply" :reset="onReset" />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'

const props = withDefaults(
	defineProps<{
		initialFilter: Record<string, unknown>
		currentFilter?: Record<string, unknown>
	}>(),
	{
		currentFilter: () => ({}),
	}
)

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

const filters = ref(cloneDeep(source.value))
const lastApplied = ref(cloneDeep(props.initialFilter))
const applied = ref(false)

const dirty = computed(() => !isEqual(filters.value, lastApplied.value))

watch(dirty, (val) => {
	emit('update:dirty', val)
})

watch(applied, (val) => {
	emit('update:applied', val)
})

watch(
	() => props.currentFilter,
	(val) => {
		if (val && Object.keys(val).length) {
			filters.value = cloneDeep(val)
		}
	},
	{ deep: true }
)

function onApply() {
	lastApplied.value = cloneDeep(filters.value)
	applied.value = true
	emit('apply', filters.value)
}

function onReset() {
	filters.value = cloneDeep(props.initialFilter)
	lastApplied.value = cloneDeep(props.initialFilter)
	applied.value = false
	emit('reset')
}

function setInitial(values: Record<string, unknown>) {
	filters.value = cloneDeep(values)
	lastApplied.value = cloneDeep(values)
	applied.value = false
}

defineExpose({
	filters,
	dirty,
	applied,
	onApply,
	onReset,
	setInitial,
})
</script>
