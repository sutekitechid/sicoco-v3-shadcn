<template>
	<div class="fixed z-[9999]" :style="{ top: y + 'px', left: x + 50 + 'px' }">
		<Dropdown>
			<template #trigger>
				<div ref="dropdownTrigger"></div>
			</template>
			<div class="text-left overflow-hidden">
				<slot />
			</div>
		</Dropdown>
	</div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import Dropdown from '../dropdown/Dropdown.vue'

const dropdownTrigger = ref(null)

const x = ref(0)
const y = ref(0)
const open = (_x, _y) => {
	dropdownTrigger.value.click()
	x.value = _x
	y.value = _y
}

defineExpose({
	open,
})
</script>

<style scoped>
.context-menu {
	position: absolute;
}
</style>
