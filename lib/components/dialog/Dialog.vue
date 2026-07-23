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
import { cva, type VariantProps } from 'class-variance-authority'
import { computed, provide } from 'vue'

const dialogContentSizeVariants = cva('', {
	variants: {
		size: {
			sm: 'tablet:w-[480px] tablet:min-h-[133px]',
			md: 'tablet:w-[600px] tablet:min-h-[190px]',
			lg: 'tablet:w-[800px] tablet:min-h-[254px]',
		},
	},
})

interface DialogProps extends DialogRootProps {
	/**
	 * Whether the dialog can be closed by clicking outside (on overlay)
	 * @default false
	 */
	closeOnClickOutside?: boolean
	/**
	 * Dialog width and minimum height on tablet screens.
	 */
	size?: VariantProps<typeof dialogContentSizeVariants>['size']
	/**
	 * Whether to display the close button in the dialog's top-right corner.
	 * @default true
	 */
	showClose?: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
	closeOnClickOutside: false,
	size: 'sm',
	showClose: true,
})

const emits = defineEmits<DialogRootEmits>()

const delegatedProps = computed(() => {
	const delegated = { ...props }
	delete delegated.closeOnClickOutside
	delete delegated.showClose
	delete delegated.size
	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

// Provide closeOnClickOutside to DialogContent
provide('dialogCloseOnClickOutside', props.closeOnClickOutside)
provide('dialogShowClose', computed(() => props.showClose))
provide(
	'dialogContentSize',
	computed(() => dialogContentSizeVariants({ size: props.size }))
)
</script>

<template>
	<DialogRoot v-bind="forwarded">
		<slot />
	</DialogRoot>
</template>
