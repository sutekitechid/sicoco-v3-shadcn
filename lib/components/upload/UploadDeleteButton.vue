<template>
	<button
		class="p-3 cursor-pointer hover:bg-grey-10 rounded z-[999]"
		@click="onClick"
	>
		<i class="si-trash-alt text-grey-60"></i>
	</button>
</template>

<script setup lang="ts">
const emits = defineEmits(['click'])
const onClick = () => {
	emits('click')
}
</script>
