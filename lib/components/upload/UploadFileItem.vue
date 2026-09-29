<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import UploadFileDetail from './UploadFileDetail.vue'
import type { UploadFile, UploadFileMetadata, UploadStatus } from './types'

interface Props {
	file: UploadFile
	metadata?: UploadFileMetadata
	status?: UploadStatus
	error?: string
	class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const slots = defineSlots<{
	details?: (props: { file: UploadFile; metadata?: UploadFileMetadata }) => unknown
	actions?: () => unknown
}>()
</script>

<template>
	<Primitive
		as="div"
		:class="cn('flex items-center gap-2 rounded-lg border bg-white p-4', status === 'failed' ? 'border-danger-main' : 'border-main', props.class)"
	>
		<div class="min-w-0 flex-1">
			<slot v-if="slots.details" name="details" :file="file" :metadata="metadata" />
			<UploadFileDetail v-else :file="file" :metadata="metadata" />
		</div>
		<slot name="actions" />
	</Primitive>
</template>
