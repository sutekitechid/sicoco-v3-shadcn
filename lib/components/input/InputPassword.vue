<template>
	<div
		:class="[
			eyeIcon,
			'text-neutral-60 cursor-pointer ml-2 z-[999] absolute top-1/2 right-3 -translate-y-1/2',
		]"
		@click="emits('update:show', !show)"
	/>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	show: boolean
}>()

const emits = defineEmits<(event: 'update:show', value: boolean) => void>()

const eyeIcon = computed(() => {
	return props.show ? 'si-eye-off' : 'si-eye'
})
</script>
