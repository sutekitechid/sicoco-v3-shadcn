<script setup lang="ts">
/**
 * ImageCropperToolbar - Action buttons for the image cropper.
 *
 * @prop {boolean} disabledReset - Whether the reset button is disabled.
 *
 * @emits reset - Emitted when reset button is clicked.
 * @emits cancel - Emitted when cancel button is clicked.
 * @emits apply - Emitted when apply button is clicked.
 */
import { type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { imageCropperToolbarVariants } from './index'
import Button from '../button/Button.vue'

interface Props {
	disabledReset?: boolean
	class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
	disabledReset: false,
})

const emits = defineEmits<{
	reset: []
	cancel: []
	apply: []
}>()
</script>

<template>
	<div :class="cn(imageCropperToolbarVariants(), props.class)">
		<Button
			variant="tertiary-primary"
			size="sm"
			:disabled="disabledReset"
			@click="emits('reset')"
		>
			Reset
		</Button>

		<div class="flex items-center gap-2">
			<Button
				variant="secondary-primary"
				size="sm"
				@click="emits('cancel')"
			>
				Batal
			</Button>
			<Button
				variant="primary"
				size="sm"
				@click="emits('apply')"
			>
				Terapkan
			</Button>
		</div>
	</div>
</template>
