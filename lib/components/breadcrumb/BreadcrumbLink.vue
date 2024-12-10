<script lang="ts" setup>
/**
 * BreadcrumbLink component is used to wrap the breadcrumb item link.
 * @slot default - Content to be displayed inside the link
 *
 * @props class - Additional classes
 */
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { breadcrumbLinkVariant } from '.'

const props = withDefaults(
	defineProps<
		PrimitiveProps & { class?: HTMLAttributes['class']; disabled?: boolean }
	>(),
	{
		as: 'a',
	}
)
</script>

<template>
	<Primitive
		:as="disabled ? 'span' : props.as"
		:as-child="asChild"
		:class="cn(props.class, breadcrumbLinkVariant({ disabled }))"
	>
		<slot />
	</Primitive>
</template>
