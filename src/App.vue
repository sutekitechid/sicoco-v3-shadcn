<script setup lang="ts">
import { useRoute } from 'vue-router'
import DocsLayout from './layouts/DocsLayout.vue'

const route = useRoute()
</script>

<template>
	<DocsLayout v-if="route.path !== '/'">
		<router-view />
	</DocsLayout>
	<router-view v-else />
</template>
