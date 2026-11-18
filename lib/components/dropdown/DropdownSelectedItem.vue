<script setup lang="ts">
import { inject } from 'vue'
import Badge from '../badge/Badge.vue'
import type { Option } from '.'

interface Props {
	value: Option
	removable?: boolean
	size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
	removable: true,
})

const emit = defineEmits<{
	(e: 'remove', value: Option): void
}>()

const onRemoveSelectedItem = inject('onRemoveSelectedItem', (_val: Option) => { return _val })

function onClickRemove() {
	onRemoveSelectedItem(props.value)
	emit('remove', props.value)
}
</script>

<template>
	<Badge
		:closeable="props.removable"
		variant="primary"
		:size="props.size"
		:rounded="false"
		class="max-w-full min-w-0"
		@close.stop="onClickRemove"
	>
		<span class="flex-1 min-w-0 truncate"><slot /></span>
	</Badge>
</template>
