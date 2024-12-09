<template>
	<img :src="getFileTypeIcon(file)" alt="" />
</template>

<script lang="ts" setup>
import { getFileTypeIcon } from '../../utils/file'

const props = defineProps<{
	file: File
}>()
</script>
