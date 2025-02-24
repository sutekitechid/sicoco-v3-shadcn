<template>
	<div>
		<slot name="header"></slot>
	</div>
</template>
<script lang="ts">
import uniqueId from 'lodash/uniqueId'
import { computed } from 'vue'

export default {
	name: 'DataTableColumn',
	props: {
		field: {
			type: String,
			default: '',
		},
		sortable: {
			type: Boolean,
			default: false,
		},
		headerTextWrap: {
			type: Boolean,
			default: true,
		}
	},
	data() {
		return {
			_isTableColumn: true,
		}
	},
	setup(props, { expose }) {
		const computedField = computed(() => {
			if (props.field) {
				return props.field
			}
			return `column-${uniqueId()}`
		})
		expose({
			computedField,
		})
		return {
			computedField,
		}
	},
}
</script>
