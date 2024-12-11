<script setup lang="ts">
import type { TabsRootProps, TabsRootEmits } from 'radix-vue'
import { TabsRoot, useForwardPropsEmits } from 'radix-vue'
import { provide } from 'vue'

const props = defineProps<TabsRootProps & { variant?: 'default' | 'boxes' }>()

const emits = defineEmits<TabsRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

provide('variant', props.variant)
</script>

<template>
	<TabsRoot v-bind="forwarded">
		<slot />
	</TabsRoot>
</template>
