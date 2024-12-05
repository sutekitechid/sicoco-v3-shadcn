<script lang="ts" setup>
/**
 * Breadcrumb component is a wrapper for BreadcrumbList component.
 * @slot default - BreadcrumbItem components
 *
 * @props class - Additional classes
 *
 * @example
 * <Breadcrumb>
 *  <BreadcrumbItem>Home</BreadcrumbItem>
 * <BreadcrumbItem>Library</BreadcrumbItem>
 * </Breadcrumb>
 */
import type { HTMLAttributes } from 'vue'
import { BreadcrumbList } from '.'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<nav aria-label="breadcrumb" :class="props.class">
		<BreadcrumbList>
			<slot />
		</BreadcrumbList>
	</nav>
</template>
