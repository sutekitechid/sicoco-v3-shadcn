<script setup lang="ts">
import { DrawerPortal as RekaDrawerPortal, type DrawerPortalProps } from 'reka-ui'

const props = defineProps<DrawerPortalProps>()
</script>

<template>
	<RekaDrawerPortal v-bind="props">
		<slot />
	</RekaDrawerPortal>
</template>
