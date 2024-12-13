<template>Hello World</template>

<script lang="ts">
/**
 * Test component is used to test the component.
 * @example
 * <Test title="Test Title" description="Test Description" />
 */
export default {
	props: {
		/**
		 * Title of the test.
		 */
		title: {
			type: String,
			required: true,
		},
		/**
		 * Description of the test.
		 */
		description: {
			type: String,
			required: true,
		},
	},
	setup() {
		const counter = (ref: Ref<number>) => {
			ref.value += 1
		}
		return {
			counter,
		}
	},
	methods: {
		/**
		 * Method to increment the counter.
		 */
		incrementCounter() {
			this.counter += 1
		},
	},
}
</script>
