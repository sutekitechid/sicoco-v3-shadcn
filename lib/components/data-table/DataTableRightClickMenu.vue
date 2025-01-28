<template>
	<ContextMenuRoot v-model:open="contextMenuOpened">
		<ContextMenuTrigger as-child>
			<slot name="trigger" />
		</ContextMenuTrigger>
		<ContextMenuPortal>
			<ContextMenuContent class="z-[999]">
				<Dropdown ref="dataTableRowDropdown" class="context-menu" :scrollable="false">
					<template #trigger>
						<div ref="dropdownTrigger"></div>
					</template>
					<div class="text-left overflow-hidden">
						<slot />
					</div>
				</Dropdown>
			</ContextMenuContent>
		</ContextMenuPortal>
	</ContextMenuRoot>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dropdown from '../dropdown/Dropdown.vue'
import {
	ContextMenuRoot,
	ContextMenuContent,
	ContextMenuTrigger,
	ContextMenuPortal
} from 'radix-vue'

const dataTableRowDropdown = ref(null)

const contextMenuOpened = ref(false)

watch(contextMenuOpened, (value) => {
	if (value) {
		setTimeout(() => {
			dataTableRowDropdown.value.openDropdown()
		}, 10)
	}
})
</script>

<style scoped>
.context-menu {
	position: absolute;
}
</style>
