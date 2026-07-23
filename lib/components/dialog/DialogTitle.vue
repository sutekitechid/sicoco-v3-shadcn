<script setup lang="ts">
import { DialogTitle as RekaDialogTitle, type DialogTitleProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<
	DialogTitleProps & {
		class?: HTMLAttributes['class']
	}
>()
</script>

<template>
	<RekaDialogTitle
		v-bind="props"
		:class="cn('font-semibold', props.class)"
	>
		<slot />
	</RekaDialogTitle>
</template>
