<script lang="ts" setup>
import { CalendarGridBody, type CalendarGridBodyProps } from 'radix-vue'

const props = defineProps<CalendarGridBodyProps>()
</script>

<template>
	<CalendarGridBody v-bind="props" class="calendar-grid-body">
		<slot />
	</CalendarGridBody>
</template>

<style>
tbody.calendar-grid-body tr {
	@apply !gap-1;
}
</style>
