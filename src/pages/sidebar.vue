<script setup lang="ts">
import AppSidebar from '../components/AppSidebar.vue'
</script>

<template>
	<div class="p-6">
		<h1>Sidebar</h1>
		<p class="mb-6 text-neutral-60">A composable sidebar component.</p>

		<div class="flex rounded-lg overflow-hidden">
			<AppSidebar />
			<main class="flex-1 bg-neutral-10 p-10">
				<p>Main content area</p>
			</main>
		</div>
	</div>
</template>
