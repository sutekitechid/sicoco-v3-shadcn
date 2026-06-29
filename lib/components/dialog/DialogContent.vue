<script setup lang="ts">
/**
 * Dialog content component that wraps the dialog content.
 *
 * @slot - Default slot for the dialog content.
 * @prop {string} zIndex - Z-index for the dialog. Default: '50'
 *
 * @example
 * <Dialog>
 *  <DialogContent>
 *  <p>Dialog content goes here.</p>
 *  </DialogContent>
 * </Dialog>
 */
import { cn } from '../../utils/tw-merge'
import {
	DialogContent,
	type DialogContentEmits,
	type DialogContentProps,
	DialogOverlay,
	DialogPortal,
	useForwardPropsEmits,
} from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { DialogTitle } from 'reka-ui'

const props = withDefaults(
	defineProps<
		DialogContentProps & {
			class?: HTMLAttributes['class']
			zIndex?: string
		}
	>(),
	{
		zIndex: '50',
	}
)

const emits = defineEmits<DialogContentEmits>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

// Inject closeOnClickOutside from parent Dialog component
const closeOnClickOutside = inject<boolean>('dialogCloseOnClickOutside', false)

/**
 * Handle interact outside event (clicking on overlay)
 * Prevents dialog from closing unless closeOnClickOutside is enabled
 * @param event
 */
const handleInteractOutside = (event: Event) => {
	if (!closeOnClickOutside) {
		event.preventDefault()
	}
}
</script>

<template>
	<DialogPortal>
		<DialogOverlay
			class="fixed inset-0 bg-neutral-950/50 dark:bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
			:style="{ zIndex: props.zIndex }"
		/>
		<DialogContent
			v-bind="forwarded"
			:style="{ zIndex: props.zIndex }"
			:class="
				cn(
					'fixed left-1/2 top-1/2 grid w-full -translate-x-1/2 -translate-y-1/2 border bg-white dark:bg-neutral-100 px-2 py-8 shadow-lg rounded-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] overflow-hidden',
					props.class
				)
			"
			@interact-outside="handleInteractOutside"
		>
			<DialogTitle />
			<div :class="cn('max-h-[80vh] overflow-y-auto px-10 py-3')">
				<slot />
			</div>
		</DialogContent>
	</DialogPortal>
</template>
