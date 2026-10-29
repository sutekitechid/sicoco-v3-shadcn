<script setup lang="ts">
import {
	DrawerContent as RekaDrawerContent,
	type DrawerContentEmits,
	type DrawerContentProps,
	DrawerOverlay,
	DrawerPortal,
	DrawerHandle,
	useForwardPropsEmits,
} from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props extends DrawerContentProps {
	class?: HTMLAttributes['class']
	showSwipeHandle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	showSwipeHandle: true,
})
const emits = defineEmits<DrawerContentEmits>()

const delegatedProps = computed(() => {
	const delegated: Partial<Props> = { ...props }
	delete delegated.class
	delete delegated.showSwipeHandle
	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
const closeOnClickOutside = inject<boolean>('drawerCloseOnClickOutside', false)

function handleInteractOutside(event: Event) {
	if (!closeOnClickOutside) event.preventDefault()
}
</script>

<template>
	<DrawerPortal>
		<DrawerOverlay
			class="fixed inset-0 z-50 bg-neutral-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<RekaDrawerContent
			v-bind="forwarded"
			data-slot="drawer-content"
			:class="
				cn(
					'group/drawer-content fixed z-50 flex max-h-[calc(100dvh-6rem)] w-full flex-col bg-white text-main shadow-lg outline-none duration-300 dark:bg-neutral-100 data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:data-[state=closed]:slide-out-to-bottom data-[swipe-direction=down]:data-[state=open]:slide-in-from-bottom data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:data-[state=closed]:slide-out-to-top data-[swipe-direction=up]:data-[state=open]:slide-in-from-top data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:h-dvh data-[swipe-direction=left]:max-h-dvh data-[swipe-direction=left]:w-[450px] data-[swipe-direction=left]:max-w-full data-[swipe-direction=left]:data-[state=closed]:slide-out-to-left data-[swipe-direction=left]:data-[state=open]:slide-in-from-left data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:h-dvh data-[swipe-direction=right]:max-h-dvh data-[swipe-direction=right]:w-[450px] data-[swipe-direction=right]:max-w-full data-[swipe-direction=right]:data-[state=closed]:slide-out-to-right data-[swipe-direction=right]:data-[state=open]:slide-in-from-right',
					props.class
				)
			"
			@interact-outside="handleInteractOutside"
		>
			<DrawerHandle
				v-if="showSwipeHandle"
				data-slot="drawer-swipe-handle"
				class="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-neutral-400 group-data-[swipe-direction=left]/drawer-content:hidden group-data-[swipe-direction=right]/drawer-content:hidden"
			/>
			<slot />
		</RekaDrawerContent>
	</DrawerPortal>
</template>
