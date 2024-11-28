<script setup lang="ts">
import { defineProps, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type BadgeCloseIconVariants, badgeCloseIconVariants } from './index'

const props = defineProps<{
	type?: BadgeCloseIconVariants['type']
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<i :class="cn(badgeCloseIconVariants({ type: props.type }), props.class)" />
</template>
