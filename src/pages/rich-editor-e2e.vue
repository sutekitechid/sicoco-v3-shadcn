<script setup lang="ts">
import { ref } from 'vue'
import SRichTextEditor from '@/components/rich-editor/RichTextEditor.vue'

const modelValue = ref('<p>Initial <strong>content</strong></p>')
</script>

<template>
	<SRichTextEditor
		v-model="modelValue"
		:toolbar-items="['bold']"
		data-cy="rich-editor-e2e"
	/>
	<output data-cy="rich-editor-e2e-value">{{ modelValue }}</output>
</template>
