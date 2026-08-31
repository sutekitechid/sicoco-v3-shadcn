<template>
	<i
		:class="iconClass"
		@click="emits('update:show', !show)"
	/>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	show: boolean
}>()

const emits = defineEmits<(event: 'update:show', value: boolean) => void>()

const eyeIcon = computed(() => {
	return props.show ? 'si-eye' : 'si-eye-off'
})

const iconClass = computed(() => {
	const baseClass =
		'text-neutral-600 cursor-pointer ml-2 z-10 absolute top-1/2 right-3 -translate-y-1/2'

	return cn(eyeIcon.value, baseClass)
})
</script>
