<template>
	<a
		:data-cy="dataCy"
		:class="[
			{
				'bg-primary-100 text-white hover:!bg-primary-100 dark:hover:text-grey-20 dark:bg-grey-70':
					isOptionSelected,
				'bg-grey-10 border-grey-40 text-grey-40 cursor-not-allowed': disabled,
				'cursor-pointer': !disabled,
			},
		]"
		class="s-dropdown-item"
		@click="onClick"
	>
		<slot />
	</a>
</template>

<script setup>
const props = defineProps({
	value: {
		type: [String, Number, Object, Array, Boolean],
		default: null,
	},
	dataCy: {
		type: String,
		default: 'dropdown-item',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
})
const emits = defineEmits(['click'])
</script>

<style scoped>
.s-dropdown-item {
	@apply block px-4 py-2 text-sm hover:bg-grey-10 dark:hover:bg-grey-70 dark:hover:text-white;
}
</style>
