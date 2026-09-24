<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import { Button } from '../button'
import { useLibraryI18n } from '../../i18n'

interface Props {
	disabled?: boolean
	title: string
	description: string
	class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const { t } = useLibraryI18n()

const emits = defineEmits<{
	back: []
	retry: []
}>()
</script>

<template>
	<Primitive as="div" :class="cn('flex w-full flex-col overflow-hidden', props.class)">
		<div class="flex flex-1 flex-col items-center gap-1 border border-dashed border-main p-4 mb-4 text-center w-full">
			<i class="si-heroicon-solid-exclamation-circle before:text-heading-lg text-danger-default" />
			<p class="text-label-lg font-medium text-main">{{ title }}</p>
			<p class="text-label-md text-secondary">{{ description }}</p>
		</div>
		<div class="-mx-4 -mb-4 flex w-[calc(100%+1.5rem)] flex-col gap-3 border-t border-main bg-white p-3 sm:flex-row">
			<Button type="button" class="flex-1" variant="secondary-primary" :disabled="disabled" @click="emits('back')">
				{{ t('common.back') }}
			</Button>
			<Button type="button" class="flex-1" :disabled="disabled" @click="emits('retry')">{{ t('common.retry') }}</Button>
		</div>
	</Primitive>
</template>
