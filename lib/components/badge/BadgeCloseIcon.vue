<script setup lang="ts">
import { defineProps, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type BadgeCloseIconVariants, badgeCloseIconVariants } from './index'

/**
 * Props for the BadgeCloseIcon component.
 * - `type`: Specifies the variant type for the badge icon styling.
 * - `class`: Additional CSS classes to apply to the badge icon.
 */
const props = defineProps<{
	type?: BadgeCloseIconVariants['type']
	class?: HTMLAttributes['class']
	size?: BadgeCloseIconVariants['size']
}>()
</script>

<template>
	<i :class="cn(badgeCloseIconVariants({ type }), props.class)" />
</template>
