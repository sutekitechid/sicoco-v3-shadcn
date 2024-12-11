<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { ToastRoot, type ToastRootEmits, useForwardPropsEmits } from 'radix-vue'
import { computed } from 'vue'
import { type ToastProps, toastVariants } from '.'

const props = defineProps<
	ToastProps & {
		indefinite?: boolean
	}
>()

const emits = defineEmits<ToastRootEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const computedDuration = computed(() => {
	if (props.indefinite) {
		return Infinity
	}

	return props.duration || 5000
})
</script>

<template>
	<ToastRoot
		v-bind="forwarded"
		:class="cn(toastVariants({ variant }), props.class)"
		:duration="computedDuration"
		class="p-3"
		@update:open="onOpenChange"
	>
		<slot />
	</ToastRoot>
</template>
