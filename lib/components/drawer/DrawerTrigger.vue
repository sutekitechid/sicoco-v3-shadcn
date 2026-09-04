<script setup lang="ts">
import { DrawerTrigger as RekaDrawerTrigger, type DrawerTriggerProps } from 'reka-ui'

const props = defineProps<DrawerTriggerProps>()
</script>

<template>
	<RekaDrawerTrigger v-bind="props">
		<slot />
	</RekaDrawerTrigger>
</template>
