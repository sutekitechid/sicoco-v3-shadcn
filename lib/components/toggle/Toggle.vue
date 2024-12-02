<script setup lang="ts">
import { ref, computed, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import {
	SwitchRoot,
	type SwitchRootEmits,
	type SwitchRootProps,
	SwitchThumb,
	useForwardPropsEmits,
} from 'radix-vue'

interface Props extends SwitchRootProps {
	class?: HTMLAttributes['class']
	modelValue?: boolean | string
	trueValue?: boolean | string
	falseValue?: boolean | string
	disabled?: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
	(e: 'update:modelValue', value: boolean | string): void
	(e: 'change', value: boolean | string): void
	(e: 'input'): void
}>()

// Computed for delegated props
const delegatedProps = computed(() => {
	const {
		class: _,
		modelValue,
		trueValue,
		falseValue,
		disabled,
		...delegated
	} = props
	return delegated
})

// Forward delegated props and emits
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
	<SwitchRoot
		v-bind="forwarded"
		:disabled="disabled"
		:class="
			cn(
				'peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-4 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-100 data-[state=unchecked]:bg-grey-30 hover:data-[state=unchecked]:bg-grey-20 focus:ring-4 focus:ring-primary-20',
				props.class
			)
		"
	>
		<SwitchThumb
			:class="
				cn(
					'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5'
				)
			"
		>
			<slot name="thumb" />
		</SwitchThumb>
	</SwitchRoot>
</template>
