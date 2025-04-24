<template>
	<div
		@scroll.passive="handleScroll"
		ref="scrollContainer"
		style="overflow-y: auto; height: 500px"
	>
		<!-- Your list -->
		<div v-for="item in items" :key="item.id">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae
			nisi quam. Vivamus ultrices sapien tortor, et imperdiet augue consequat
			nec. Nulla lectus ex, laoreet non lacinia ac, efficitur in libero. Duis
			sit amet sodales arcu. Nam ac lectus enim. Morbi tellus nibh, condimentum
			vitae urna nec, semper convallis orci. Fusce ornare pulvinar magna. Morbi
			sodales ac magna et commodo. Vestibulum gravida lacus et erat consectetur
			scelerisque. Nulla vel elementum eros, eget suscipit odio. Vivamus id
			scelerisque enim. Mauris suscipit, velit in malesuada egestas, nunc sem
			auctor augue, sed faucibus nunc arcu eget odio. Vestibulum eu elit
			interdum, accumsan leo ut, eleifend nisl. Phasellus vel dolor magna.
			Quisque mollis ultrices nulla sit amet ullamcorper. Fusce quis diam quis
			ex lacinia bibendum. Sed ullamcorper commodo mauris non pharetra. Maecenas
			dictum risus sapien, a rhoncus diam commodo ut. Quisque congue pulvinar
			erat, a blandit justo fermentum eget. Vestibulum ullamcorper ornare
			dapibus. Ut in commodo orci, blandit dignissim lacus. Nam efficitur augue
			vitae dolor mollis, egestas faucibus diam lacinia. {{ item.name }}
		</div>

		<div v-if="loading">Loading...</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
	setup() {
		const items = ref([]) // Reactive array for items
		const loading = ref(false) // Reactive loading state
		const scrollContainer = ref(null) // Ref for the scrollable container

		// Function to handle scroll events
		const handleScroll = () => {
			const container = scrollContainer.value
			console.log('container', container)
			if (!container) return

			const nearBottom =
				container.scrollHeight - container.scrollTop - container.clientHeight <
				10

			if (nearBottom && !loading.value) {
				loadMore()
			}
		}

		// Function to load more items
		const loadMore = () => {
			loading.value = true

			// Simulate API call
			setTimeout(() => {
				const moreItems = Array.from({ length: 10 }, (_, i) => ({
					id: items.value.length + i,
					name: `Item ${items.value.length + i}`,
				}))

				items.value.push(...moreItems)
				loading.value = false
			}, 1000)
		}

		// Initial data load
		onMounted(() => {
			loadMore()
		})

		return {
			items,
			loading,
			scrollContainer,
			handleScroll,
		}
	},
}
</script>
