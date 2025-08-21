<script setup lang="ts">
/**
 * Dialog component that wraps the dialog content and provides the overlay and portal.
 *
 * @slot - Default slot for the dialog content.
 *
 * @example
 * <Dialog>
 *  <DialogContent>
 *  <p>Dialog content goes here.</p>
 *  </DialogContent>
 * </Dialog>
 */
import {
	DialogRoot,
	type DialogRootEmits,
	type DialogRootProps,
	useForwardPropsEmits,
} from 'reka-ui'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<DialogRoot v-bind="forwarded">
		<slot />
	</DialogRoot>
</template>
