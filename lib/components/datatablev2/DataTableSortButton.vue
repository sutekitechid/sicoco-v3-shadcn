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
			<div class="flex items-center">
				<i v-if="sortState === SORT_DIRECTION.Asc" class="si-sort-ascending text-xs" />
				<i v-else-if="sortState === SORT_DIRECTION.Desc" class="si-sort-descending text-xs" />
				<i v-else class="si-sort text-xs" />
	
				<!-- Multiple sort index indicator -->
				<span
					v-if="sortIndex && sortIndex > 1"
					class="text-xs font-medium ml-0.5"
				>
					{{ sortIndex }}
				</span>
			</div>
		</Button>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { Button } from '../button'
import { SORT_DIRECTION } from '.'

defineProps({
	sortState: {
		type: String, // SORT_DIRECTION.Asc, SORT_DIRECTION.Desc, or null
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
