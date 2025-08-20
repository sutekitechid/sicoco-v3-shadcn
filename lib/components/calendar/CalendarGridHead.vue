<script lang="ts" setup>
import { CalendarGridHead, type CalendarGridHeadProps } from 'reka-ui'

const props = defineProps<CalendarGridHeadProps>()
</script>

<template>
	<CalendarGridHead v-bind="props" class="calendar-grid-head">
		<slot />
	</CalendarGridHead>
</template>

<style>
thead.calendar-grid-head tr {
	@apply !gap-1;
}
</style>
