<script lang="ts" setup>
import {
	RangeCalendarGridHead,
	type RangeCalendarGridHeadProps,
} from 'radix-vue'

const props = defineProps<RangeCalendarGridHeadProps>()
</script>

<template>
	<RangeCalendarGridHead v-bind="props" class="range-calendar-grid-head">
		<slot />
	</RangeCalendarGridHead>
</template>

<style>
thead.range-calendar-grid-head tr {
	@apply !gap-1;
}
</style>
