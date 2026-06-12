<script setup lang="ts">
import { inject } from 'vue'
import Badge from '../badge/Badge.vue';
import type { Option } from '.'

const props = defineProps<{
	value: Option
}>()

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
    <Badge closeable variant="grey" @close.stop="onClickRemove">
        <slot></slot>
    </Badge>
</template>