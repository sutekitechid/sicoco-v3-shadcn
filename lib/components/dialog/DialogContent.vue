<script setup lang="ts">
/**
 * Dialog content component that wraps the dialog content.
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
import { cn } from '../../utils/tw-merge'
import {
	DialogContent,
	type DialogContentEmits,
	type DialogContentProps,
	DialogOverlay,
	DialogPortal,
	useForwardPropsEmits,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { DialogTitle } from 'radix-vue'

const props = withDefaults(
	defineProps<
		DialogContentProps & { class?: HTMLAttributes['class']; zIndex?: string }
	>(),
	{
		zIndex: '50',
	}
)

const emits = defineEmits<DialogContentEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

/**
 * This function prevents the dialog from closing when clicking outside of it.
 * @param event
 */
const preventCloseWhenClickOutside = event => {
	event.preventDefault()
}
</script>

<template>
	<DialogPortal>
		<DialogOverlay
			class="fixed inset-0 bg-neutral-100/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
			:style="{ zIndex: props.zIndex }"
		/>
		<Transition
			enter-active-class="transition ease-out duration-300"
			enter-from-class="opacity-0 scale-95"
			enter-to-class="opacity-100 scale-100"
			leave-active-class="transition ease-in duration-200"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-95"
		>
			<DialogContent
				v-bind="forwarded"
				:style="{ zIndex: props.zIndex }"
				:class="
					cn(
						'fixed left-1/2 top-1/2 grid w-full  -translate-x-1/2 -translate-y-1/2 border bg-white dark:bg-neutral-10 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
						props.class
					)
				"
				@interact-outside="preventCloseWhenClickOutside"
			>
				<DialogTitle />
				<slot />
			</DialogContent>
		</Transition>
	</DialogPortal>
</template>
