<template>
	<div
		ref="scrollContainer"
		class="infinite-scroll-container"
		@scroll="onScroll"
	>
		<ul>
			<li v-for="(item, index) in items" :key="index">{{ item }}</li>
		</ul>
		<div v-if="loading" class="loading-indicator">Loading...</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { handleInfiniteScroll } from '../../lib/utils/pagination'

export default defineComponent({
	name: 'InfiniteScroll',
	setup() {
		const items = ref<string[]>([])
		const loading = ref(false)
		const scrollContainer = ref<HTMLElement | null>(null)

		const loadMoreItems = () => {
			if (loading.value) return
			loading.value = true

			// Simulate an API call
			setTimeout(() => {
				const newItems = Array.from(
					{ length: 10 },
					(_, i) => `Item ${items.value.length + i + 1}`
				)
				items.value.push(...newItems)
				loading.value = false
			}, 1000)
		}

		const onScroll = () => {
			if (scrollContainer.value) {
				handleInfiniteScroll(scrollContainer.value, loadMoreItems)
			}
		}

		onMounted(() => {
			loadMoreItems() // Load initial items
		})

		return {
			items,
			loading,
			scrollContainer,
			onScroll,
		}
	},
})
</script>

<style scoped>
.infinite-scroll-container {
	height: 200px;
	overflow-y: auto;
	border: 1px solid #ccc;
	padding: 10px;
}

.loading-indicator {
	text-align: center;
	margin-top: 10px;
}
</style>
