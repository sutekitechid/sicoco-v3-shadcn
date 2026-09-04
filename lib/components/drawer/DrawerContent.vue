<script setup lang="ts">
import {
	DrawerContent as RekaDrawerContent,
	type DrawerContentEmits,
	type DrawerContentProps,
	DrawerOverlay,
	DrawerPortal,
	useForwardPropsEmits,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props extends DrawerContentProps {
	class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const emits = defineEmits<DrawerContentEmits>()

const delegatedProps = computed(() => {
	const delegated = { ...props }
	delete delegated.class
	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
	<DrawerPortal>
		<DrawerOverlay
			class="fixed inset-0 z-50 bg-neutral-950/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
		/>
		<RekaDrawerContent
			v-bind="forwarded"
			:class="cn('fixed inset-x-0 bottom-0 z-50 w-full rounded-t-[24px] bg-white p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom', props.class)"
		>
			<slot />
		</RekaDrawerContent>
	</DrawerPortal>
</template>
