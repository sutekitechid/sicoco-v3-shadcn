<script lang="ts" setup>
import { RangeCalendarGridBody, type RangeCalendarGridBodyProps } from 'reka-ui'

const props = defineProps<RangeCalendarGridBodyProps>()
</script>

<template>
	<RangeCalendarGridBody v-bind="props" class="range-calendar-grid-body">
		<slot />
	</RangeCalendarGridBody>
</template>

<style>
tbody.range-calendar-grid-body tr {
	@apply !gap-1;
}
</style>
