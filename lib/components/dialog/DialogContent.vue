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
	DialogClose,
	DialogContent,
	type DialogContentEmits,
	type DialogContentProps,
	DialogOverlay,
	DialogPortal,
	useForwardPropsEmits,
} from 'reka-ui'
import { computed, inject, type ComputedRef, type HTMLAttributes } from 'vue'
import Button from '../button/Button.vue'

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
const dialogAttrs = inject<Record<string, unknown>>('dialogAttrs', {})
const dialogContentSize = inject('dialogContentSize', '')
const dialogContentPosition = inject('dialogContentPosition', '')
const showClose = inject<ComputedRef<boolean>>(
	'dialogShowClose',
	computed(() => false)
)

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
			v-bind="{ ...dialogAttrs, ...forwarded }"
			:style="{ zIndex: props.zIndex }"
			:class="
				cn(
					'fixed left-1/2 grid w-[calc(100%-3rem)] -translate-x-1/2 overflow-hidden rounded-lg border bg-white shadow-lg duration-100 dark:bg-neutral-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
					dialogContentSize,
					dialogContentPosition,
					props.class
				)
			"
			@interact-outside="handleInteractOutside"
		>
			<DialogClose v-if="showClose" as-child>
				<Button
					class="absolute right-4 top-4 z-10"
					variant="tertiary-primary"
					size="sm"
					icon-left="si-heroicon-solid-x-mark"
					aria-label="Close dialog"
				/>
			</DialogClose>
			<div :class="cn('pt-4 pb-5')">
				<slot />
			</div>
		</DialogContent>
	</DialogPortal>
</template>
