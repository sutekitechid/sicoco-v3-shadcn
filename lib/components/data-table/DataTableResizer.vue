<template>
	<div
		:class="[
			{
				'!bg-primary-100': header.column.getIsResizing(),
			},
		]"
		class="w-1 h-full bg-neutral-40 cursor-col-resize absolute right-0 top-0 hidden group-hover:block"
	>
		&nbsp;
	</div>
</template>

<script setup lang="ts">
defineProps<{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	header: any
}>()
</script>
