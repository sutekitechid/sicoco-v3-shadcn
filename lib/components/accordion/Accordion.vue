<script setup lang="ts">
import {
	AccordionRoot,
	type AccordionRootEmits,
	type AccordionRootProps,
	useForwardPropsEmits,
} from 'radix-vue'

const props = withDefaults(defineProps<AccordionRootProps>(), {
	/**
	 * The type of accordion. Determines whether the accordion allows a single open item
	 * or multiple items to be open simultaneously.
	 *
	 * @default 'single'
	 * @type {'single' | 'multiple'}
	 */
	type: 'single',
})

const emits = defineEmits<AccordionRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<AccordionRoot v-bind="forwarded">
		<slot />
	</AccordionRoot>
</template>
