<script lang="ts" setup>
import { CalendarGridHead, type CalendarGridHeadProps } from 'reka-ui'

const props = defineProps<CalendarGridHeadProps>()
</script>

<template>
	<CalendarGridHead v-bind="props" class="calendar-grid-head tablet:w-96">
		<slot />
	</CalendarGridHead>
</template>

<style>
	@reference "../../config/tailwind.css";

thead.calendar-grid-head tr {
	@apply !gap-1;
}
</style>
