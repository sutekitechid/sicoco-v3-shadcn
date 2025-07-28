<template>
	<div class="flex items-center gap-1 ml-2">
		<!-- Sort Button -->
		<Button
			v-if="showSortControls"
			class="w-6 h-6 transition-colors border-none group"
			outlined
			size="sm"
			:class="sortButtonClass"
			type="button"
			@click.stop="$emit('toggle-sort')"
		>
			<i v-if="sortState === 'asc'" class="si-sort-ascending text-xs" />
			<i v-else-if="sortState === 'desc'" class="si-sort-descending text-xs" />
			<i v-else class="si-sort text-xs" />

			<!-- Multiple sort index indicator -->
			<span
				v-if="sortIndex && sortIndex > 1"
				class="text-xs font-medium ml-1 text-primary-60"
			>
				{{ sortIndex }}
			</span>
		</Button>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { Button } from '../button'

defineProps({
	sortState: {
		type: String, // 'asc', 'desc', or null
		default: null,
	},
	sortIndex: {
		type: Number,
		default: null,
	},
	showSortControls: {
		type: Boolean,
		default: true,
	},
})

defineEmits(['toggle-sort'])

const sortButtonClass = computed(() => ({}))
</script>
