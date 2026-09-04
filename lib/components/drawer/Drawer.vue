<script setup lang="ts">
import {
	DrawerRoot,
	type DrawerRootEmits,
	type DrawerRootProps,
	useForwardPropsEmits,
} from 'reka-ui'
import { computed } from 'vue'

const props = defineProps<DrawerRootProps>()
const emits = defineEmits<DrawerRootEmits>()

const forwarded = useForwardPropsEmits(computed(() => props), emits)
</script>

<template>
	<DrawerRoot v-bind="forwarded">
		<slot />
	</DrawerRoot>
</template>
