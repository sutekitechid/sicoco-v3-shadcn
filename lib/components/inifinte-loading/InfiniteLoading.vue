<template>
	<slot />
	<InfiniteLoading
		@infinite="onInfinite"
		:distance="distance"
		:top="top"
		:identifier="identifier"
		:target="target"
		:firstload="firstload"
	>
		<slot name="complete" />
		<slot name="error" />
	</InfiniteLoading>
</template>

<script setup>
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'

defineProps({
	/**
	 * Callback function to be called when the infinite loading is triggered.
	 * @param {Object} $state - The state object to control the loading state.
	 * @param {Function} $state.loaded - Call this method to indicate that the loading is complete.
	 * @param {Function} $state.complete - Call this method to indicate that there is no more data to load.
	 */
	callback: {
		type: Function,
		default: undefined,
	},
	target: {
		type: String,
		default: undefined,
	},
	distance: {
		type: Number,
		default: 0,
	},
	top: {
		type: Boolean,
		default: false,
	},
	identifier: {
		type: String,
		default: 'id',
	},
	firstload: {
		type: Boolean,
		default: false,
	},
})

const emits = defineEmits(['loaded', 'error'])

async function onInfinite($state) {
	if (!props.callback) {
		$state.complete()
		return
	}

	try {
		const result = await props.callback($state)
		if (!result || result.length === 0) {
			$state.complete()
		} else {
			$state.loaded()
			emits('loaded', result)
		}
	} catch (error) {
		$state.error()
		emits('error', error)
	}
}
</script>
