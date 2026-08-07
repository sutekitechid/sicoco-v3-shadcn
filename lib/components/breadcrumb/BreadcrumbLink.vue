<script lang="ts" setup>
/**
 * BreadcrumbLink component is used to wrap the breadcrumb item link.
 * @slot default - Content to be displayed inside the link
 *
 * @props class - Additional classes
 */
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '../../utils/tw-merge'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { breadcrumbLinkVariant } from '.'

const props = withDefaults(
	defineProps<
		PrimitiveProps & {
			class?: HTMLAttributes['class']
			disabled?: boolean
			to?: string | unknown
		}
	>(),
	{
		as: 'a',
		to: undefined,
	}
)

const computedAs = computed(() => {
	if (props.disabled || props.to === undefined) {
		return 'span'
	}
	return props.as
})
</script>

<template>
	<Primitive
		:as="computedAs"
		:as-child="asChild"
		:href="props.to"
		:to="props.to"
		:class="[
			cn(props.class, breadcrumbLinkVariant({ disabled: props.disabled, noLink: props.to === undefined })),
			{ 'text-primary-default': props.to !== undefined },
		]"
	>
		<slot />
	</Primitive>
</template>
