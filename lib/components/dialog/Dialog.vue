<script setup lang="ts">
/**
 * Dialog component that wraps the dialog content and provides the overlay and portal.
 *
 * @slot - Default slot for the dialog content.
 * @prop {boolean} closeOnClickOutside - Whether the dialog can be closed by clicking outside. Default: false
 *
 * @example
 * <Dialog>
 *  <DialogContent>
 *  <p>Dialog content goes here.</p>
 *  </DialogContent>
 * </Dialog>
 *
 * @example
 * <!-- Allow closing by clicking outside -->
 * <Dialog :close-on-click-outside="true">
 *  <DialogContent>
 *  <p>Click outside to close.</p>
 *  </DialogContent>
 * </Dialog>
 */
import {
	DialogRoot,
	type DialogRootEmits,
	type DialogRootProps,
	useForwardPropsEmits,
} from 'reka-ui'
import { provide } from 'vue'

interface DialogProps extends DialogRootProps {
	/**
	 * Whether the dialog can be closed by clicking outside (on overlay)
	 * @default false
	 */
	closeOnClickOutside?: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
	closeOnClickOutside: false,
})

const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

// Provide closeOnClickOutside to DialogContent
provide('dialogCloseOnClickOutside', props.closeOnClickOutside)
</script>

<template>
	<DialogRoot v-bind="forwarded">
		<slot />
	</DialogRoot>
</template>
