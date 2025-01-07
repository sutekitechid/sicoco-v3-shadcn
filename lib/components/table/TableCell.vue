<script setup lang="ts">
import { useSlots, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
	value?: string | number
}>()

const slots = useSlots()
</script>

<template>
	<td
		:class="
			cn(
				'p-4 text-left align-middle [&:has([role=checkbox])]:pr-0',
				props.class
			)
		"
	>
		<template v-if="!slots.default">
			{{ props.value }}
		</template>
		<template v-else>
			<slot />
		</template>
	</td>
</template>
