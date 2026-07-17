<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type ButtonVariants, buttonVariants, buttonContentVariants } from '.'

interface Props extends PrimitiveProps {
	variant?: ButtonVariants['variant']
	size?: ButtonVariants['size']
	class?: HTMLAttributes['class']
	outlined?: boolean
	disabled?: boolean
	to?: string
	iconLeft?: string
	iconRight?: string
}

const props = withDefaults(defineProps<Props>(), {
	as: 'button',
	to: '',
})

const slots = useSlots()

const emits = defineEmits(['click'])

const onClick = (event: MouseEvent) => {
	if (props.disabled) {
		event.preventDefault()
		event.stopPropagation()
		return
	}

	return emits('click', event)
}

const isRouterLink = computed(() => {
	return props.as === 'router-link'
})

const computedAsChild = computed(() => {
	if (isRouterLink.value) return true
	return props.asChild
})

const hasLeftIcon = computed(() =>
	Boolean(props.iconLeft || slots['icon-left'])
)

const hasRightIcon = computed(() =>
	Boolean(props.iconRight || slots['icon-right'])
)

const hasText = computed(() => Boolean(slots.default))

const content = computed<NonNullable<ButtonVariants['content']>>(() => {
	if (!hasText.value && (hasLeftIcon.value || hasRightIcon.value)) {
		return 'iconOnly'
	}

	if (hasLeftIcon.value && hasRightIcon.value) return 'iconBoth'
	if (hasLeftIcon.value) return 'iconLeft'
	if (hasRightIcon.value) return 'iconRight'

	return 'default'
})
</script>

<template>
	<Primitive
		:as="as"
		:as-child="computedAsChild"
		:class="
			cn(
				buttonVariants({
					variant,
					size,
					outlined,
					disabled,
					content,
				}),
				props.class
			)
		"
		:disabled="props.disabled"
		@click="onClick"
	>
		<RouterLink v-if="isRouterLink" :to="props.to">
			<div :class="buttonContentVariants({ size })">
				<template v-if="hasLeftIcon">
					<span v-if="iconLeft">
						<i :class="iconLeft" />
					</span>
					<span v-else>
						<slot name="icon-left" />
					</span>
				</template>

				<slot />

				<template v-if="hasRightIcon">
					<span v-if="iconRight">
						<i :class="iconRight" />
					</span>
					<span v-else>
						<slot name="icon-right" />
					</span>
				</template>
			</div>
		</RouterLink>
		<template v-else>
			<div :class="buttonContentVariants({ size })">
				<template v-if="hasLeftIcon">
					<template v-if="iconLeft">
						<i :class="iconLeft" />
					</template>
					<template v-else>
						<slot name="icon-left" />
					</template>
				</template>

				<slot />

				<template v-if="hasRightIcon">
					<template v-if="iconRight">
						<i :class="iconRight" />
					</template>
					<template v-else>
						<slot name="icon-right" />
					</template>
				</template>
			</div>
		</template>
	</Primitive>
</template>

<style scoped>
a {
	@apply hover:!text-primary-700;
}
</style>
