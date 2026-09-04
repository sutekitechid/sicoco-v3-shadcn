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
import { computed, provide, useAttrs } from 'vue'

defineOptions({
	inheritAttrs: false,
})

const dialogContentSizeVariants = cva('', {
	variants: {
		size: {
			sm: 'tablet:w-[480px] tablet:min-h-[133px]',
			md: 'tablet:w-[600px] tablet:min-h-[190px]',
			lg: 'tablet:w-[800px] tablet:min-h-[254px]',
		},
	},
})

const dialogContentPositionVariants = cva('', {
	variants: {
		position: {
			center: 'top-1/2 -translate-y-1/2',
			top: 'top-1/2 -translate-y-1/2 tablet:top-[11.25rem] tablet:translate-y-0',
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
	 * Dialog vertical position. The top position is centered on mobile screens.
	 * @default 'center'
	 */
	position?: VariantProps<typeof dialogContentPositionVariants>['position']
	/**
	 * Whether to display the close button in the dialog's top-right corner.
	 * @default true
	 */
	showClose?: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
	closeOnClickOutside: false,
	size: 'sm',
	position: 'center',
	showClose: false,
})

const emits = defineEmits<DialogRootEmits>()
const attrs = useAttrs()

const delegatedProps = computed(() => {
	const delegated = { ...props }
	delete delegated.closeOnClickOutside
	delete delegated.showClose
	delete delegated.size
	delete delegated.position
	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

// Provide closeOnClickOutside to DialogContent
provide('dialogCloseOnClickOutside', props.closeOnClickOutside)
provide('dialogShowClose', computed(() => props.showClose))
provide('dialogAttrs', attrs)
provide(
	'dialogContentSize',
	computed(() => dialogContentSizeVariants({ size: props.size }))
)
provide(
	'dialogContentPosition',
	computed(() => dialogContentPositionVariants({ position: props.position }))
)
</script>

<template>
	<DialogRoot v-bind="forwarded">
		<slot />
	</DialogRoot>
</template>
