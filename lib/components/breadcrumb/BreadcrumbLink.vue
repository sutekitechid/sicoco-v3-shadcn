<script lang="ts" setup>
/**
 * BreadcrumbLink component is used to wrap the breadcrumb item link.
 * @slot default - Content to be displayed inside the link
 *
 * @props class - Additional classes
 */
import type { HTMLAttributes } from 'vue'
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
</script>

<template>
	<Primitive
		:as="disabled ? 'span' : props.as"
		:as-child="asChild"
		:href="props.to"
		:to="props.to"
		:class="[
			cn(props.class, breadcrumbLinkVariant({ disabled })),
			{ 'text-primary-100': props.to !== undefined },
		]"
	>
		<slot />
	</Primitive>
</template>
