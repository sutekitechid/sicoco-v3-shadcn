<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = withDefaults(
	defineProps<{
		modelValue?: string | number
		toolbar?: 'full' | 'essential' | 'minimal' | String | Array<string> | Object
		readOnly?: boolean
		placeholder?: string
		options?: Object
	}>(),
	{
		toolbar: 'full',
		readOnly: true,
		placeholder: '',
	}
)

const emit = defineEmits(['update:modelValue'])
</script>

<template>
	<QuillEditor
		v-model="props.modelValue"
		:toolbar="props.toolbar"
		:readOnly="props.readOnly"
		:placeholder="props.placeholder"
		:options="props.options"
		@input="value => emit('update:modelValue', value)"
	/>
</template>
