<script setup lang="ts">
/**
 * ImageCropper component that wraps vue-advanced-cropper for image cropping.
 *
 * @slot - Default slot for custom toolbar content.
 * @prop {string} src - The image source URL or base64.
 * @prop {number} aspectRatio - Crop aspect ratio (default: 1 for square).
 * @prop {'square' | 'circle'} shape - Crop area shape (default: 'square').
 * @prop {'fill-area' | 'fit-area' | 'stencil' | 'none'} imageRestriction - Image restriction mode (default: 'stencil').
 * @prop {number} minWidth - Minimum crop width (default: 150).
 * @prop {number} minHeight - Minimum crop height (default: 150).
 *
 * @example
 * <ImageCropper
 *   src="https://example.com/image.jpg"
 *   :aspect-ratio="1"
 *   shape="square"
 *   @apply="handleApply"
 *   @cancel="handleCancel"
 * />
 */
import { ref, computed, shallowRef, type HTMLAttributes } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { cn } from '../../utils/tw-merge'
import {
	imageCropperVariants,
	type ImageCropperAreaVariants,
} from './index'
import ImageCropperZoom from './ImageCropperZoom.vue'
import ImageCropperToolbar from './ImageCropperToolbar.vue'

interface Props {
	src?: string
	aspectRatio?: number
	shape?: ImageCropperAreaVariants['shape']
	class?: HTMLAttributes['class']
	stencilSize?: { width: number; height: number }
	imageRestriction?: 'fill-area' | 'fit-area' | 'stencil' | 'none'
	minWidth?: number
	minHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
	src: '',
	aspectRatio: 1,
	shape: 'square',
	imageRestriction: 'fit-area',
	minWidth: 150,
	minHeight: 150,
})

const emits = defineEmits<{
	apply: [coordinates: { left: number; top: number; width: number; height: number }, canvas: HTMLCanvasElement]
	cancel: []
	reset: []
	rotate: []
	'update:zoom': [zoom: number]
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cropperRef = shallowRef<any>(null)
// Normalized zoom: 0 = stencil at max size, 1 = stencil at min size
const currentZoom = ref(0)

const stencilProps = computed(() => {
	const base: Record<string, unknown> = {}
	if (props.aspectRatio) {
		base.aspectRatio = props.aspectRatio
	}
	if (props.stencilSize) {
		base.minWidth = props.stencilSize.width
		base.minHeight = props.stencilSize.height
	}
	return base
})

const stencilComponent = computed(() => {
	return props.shape === 'circle' ? CircleStencil : undefined
})

function handleChange() {
	const cropper = cropperRef.value
	if (!cropper) return

	const { visibleArea, imageSize } = cropper
	if (!visibleArea || !imageSize) return

	const rawZoom = 1 - (visibleArea.height / imageSize.height)
	currentZoom.value = Math.max(0, Math.min(1, rawZoom))
	emits('update:zoom', currentZoom.value)
}

function handleZoomChange(zoom: number) {
	const cropper = cropperRef.value
	if (!cropper) return

	const { imageSize, sizeRestrictions } = cropper
	if (!imageSize || !sizeRestrictions) return

	if (imageSize.height < imageSize.width) {
		const { minHeight } = sizeRestrictions
		const imageHeight = imageSize.height
		cropper.zoom(
			(imageHeight - currentZoom.value * (imageHeight - minHeight)) /
			(imageHeight - zoom * (imageHeight - minHeight))
		)
	} else {
		const { minWidth } = sizeRestrictions
		const imageWidth = imageSize.width
		cropper.zoom(
			(imageWidth - currentZoom.value * (imageWidth - minWidth)) /
			(imageWidth - zoom * (imageWidth - minWidth))
		)
	}

	currentZoom.value = zoom
	emits('update:zoom', zoom)
}

function handleRotate() {
	if (!cropperRef.value) return
	cropperRef.value.rotate(90)
	emits('rotate')
}

function handleReset() {
	if (!cropperRef.value) return
	if (currentZoom.value !== 0) {
		handleZoomChange(0)
	}
	currentZoom.value = 0
	emits('reset')
}

function handleCancel() {
	emits('cancel')
}

function handleApply() {
	if (!cropperRef.value) return
	const result = cropperRef.value.getResult()
	if (result) {
		emits('apply', result.coordinates, result.canvas)
	}
}

function getCanvas() {
	if (!cropperRef.value) return null
	const result = cropperRef.value.getResult()
	return result?.canvas ?? null
}

defineExpose({
	getCanvas,
	reset: handleReset,
	rotate: handleRotate,
})
</script>

<template>
	<div :class="cn(imageCropperVariants(), props.class)">
		<div class="relative h-100 overflow-hidden bg-neutral-800">
			<Cropper
				v-if="src"
				ref="cropperRef"
				:src="src"
				:stencil-props="stencilProps"
				:stencil-component="stencilComponent"
				:canvas="true"
				:resize-image="true"
				:move-image="true"
				:image-restriction="imageRestriction"
				:default-boundaries="'fill'"
				:transitions="false"
				:debounce="0"
				:min-width="minWidth"
				:min-height="minHeight"
				class="h-full w-full"
				@change="handleChange"
			/>
		</div>

		<ImageCropperZoom
			v-if="src"
			:model-value="currentZoom"
			@update:model-value="handleZoomChange"
			@rotate="handleRotate"
		/>

		<ImageCropperToolbar
			v-if="src"
			:disabled-reset="currentZoom === 0"
			@reset="handleReset"
			@cancel="handleCancel"
			@apply="handleApply"
		/>
		<slot />
	</div>
</template>
