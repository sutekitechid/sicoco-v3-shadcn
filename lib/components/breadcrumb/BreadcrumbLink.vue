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

const props = withDefaults(
	defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(),
	{
		as: 'a',
	}
)
</script>

<template>
	<Primitive :as="as" :as-child="asChild" :class="cn(props.class)">
		<slot />
	</Primitive>
</template>
