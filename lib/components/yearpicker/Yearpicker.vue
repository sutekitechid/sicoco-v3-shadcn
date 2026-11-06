<script setup lang="ts">
import YearPickerContent from './YearPickerContent.vue'
</script>

<template>
	<YearPickerContent v-bind="$attrs">
		<template #default="slotProps">
			<slot v-bind="slotProps" />
		</template>
	</YearPickerContent>
</template>
