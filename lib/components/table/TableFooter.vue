<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<tfoot :class="props.class">
		<slot />
	</tfoot>
</template>
