<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'

const route = useRoute()
</script>

<template>
	<div class="flex h-screen">
		<AppSidebar />
		<main class="flex-1 overflow-y-auto p-6">
			<h1>Fake Page</h1>
			<p class="text-neutral-600">
				Current route:
				<code class="bg-neutral-10 px-2 py-1 rounded">{{ route.path }}</code>
			</p>
			<p class="text-neutral-600 mt-2">
				Refresh this page to test sidebar auto-open behavior.
			</p>
		</main>
	</div>
</template>
