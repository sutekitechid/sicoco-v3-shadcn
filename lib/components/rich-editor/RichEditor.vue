<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = withDefaults(
	defineProps<{
		toolbar?: 'full' | 'essential' | 'minimal' | String | Array<string> | Object
		readOnly?: boolean
		placeholder?: string
		options?: Object
	}>(),
	{
		toolbar: 'full',
		readOnly: false,
		placeholder: '',
	}
)
</script>

<template>
	<QuillEditor
		:toolbar="props.toolbar"
		:readOnly="props.readOnly"
		:placeholder="props.placeholder"
	/>
</template>
