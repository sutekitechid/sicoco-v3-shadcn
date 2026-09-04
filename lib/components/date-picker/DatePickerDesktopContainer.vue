<script setup lang="ts">
import { ref, useSlots } from 'vue'
import { Dropdown } from '../dropdown'

const props = withDefaults(defineProps<{
	disabled?: boolean
	dataCy?: string
	dataTestid?: string
}>(), {
	disabled: false,
})

const emits = defineEmits<{
	(event: 'update:open', value: boolean): void
}>()

const slots = useSlots()
const dropdownRef = ref<{ closeDropdown: () => void } | null>(null)

function closeDropdown() {
	dropdownRef.value?.closeDropdown()
}

defineExpose({ closeDropdown })
</script>

<template>
	<Dropdown
		ref="dropdownRef"
		class="w-full"
		:model-value="null"
		:scrollable="false"
		:fit-content="true"
		:data-cy="props.dataCy"
		:data-testid="props.dataTestid ?? props.dataCy"
		:disabled="props.disabled"
		align="start"
		@update:open="emits('update:open', $event)"
	>
		<template #trigger>
			<slot name="trigger" />
		</template>
		<slot />
		<div v-if="slots.footer" class="flex justify-end gap-3 px-4 pb-4">
			<slot name="footer" />
		</div>
	</Dropdown>
</template>
