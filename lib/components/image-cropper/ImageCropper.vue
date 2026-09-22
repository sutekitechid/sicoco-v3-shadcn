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

interface CropperZoomState {
	imageSize?: { width: number; height: number }
	sizeRestrictions?: { minWidth: number; minHeight: number }
	visibleArea?: { width: number; height: number }
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
const rotation = ref(0)
const zoomBaseSize = ref<number | null>(null)

function getZoomBounds(cropper: CropperZoomState) {
	const { imageSize, sizeRestrictions, visibleArea } = cropper
	if (!imageSize || !sizeRestrictions || !visibleArea) return null

	const dimension = imageSize.height < imageSize.width ? 'height' : 'width'
	return {
		imageSize: imageSize[dimension],
		minSize: sizeRestrictions[dimension === 'height' ? 'minHeight' : 'minWidth'],
		visibleSize: visibleArea[dimension],
	}
}

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

	const zoomBounds = getZoomBounds(cropper)
	if (!zoomBounds) return

	if (zoomBaseSize.value === null) {
		zoomBaseSize.value = zoomBounds.visibleSize
	}

	const zoomRange = zoomBaseSize.value - zoomBounds.minSize
	if (zoomRange <= 0) return

	const rawZoom = (zoomBaseSize.value - zoomBounds.visibleSize) / zoomRange
	currentZoom.value = Math.max(0, Math.min(1, rawZoom))
	emits('update:zoom', currentZoom.value)
}

async function restoreFullImage(angle = rotation.value) {
	const cropper = cropperRef.value
	if (!cropper) return

	zoomBaseSize.value = null
	await cropper.reset()
	if (angle !== 0) {
		cropper.rotate(angle)
	}

	const zoomBounds = getZoomBounds(cropper)
	zoomBaseSize.value = zoomBounds?.visibleSize ?? null
	currentZoom.value = 0
}

async function handleZoomChange(zoom: number) {
	const cropper = cropperRef.value
	if (!cropper) return

	if (zoom === 0) {
		await restoreFullImage()
		emits('update:zoom', 0)
		return
	}

	const zoomBounds = getZoomBounds(cropper)
	if (!zoomBounds) return

	const baseSize = zoomBaseSize.value ?? zoomBounds.visibleSize
	const zoomRange = baseSize - zoomBounds.minSize
	if (zoomRange <= 0) return

	cropper.zoom(
		(baseSize - currentZoom.value * zoomRange) /
		(baseSize - zoom * zoomRange)
	)

	currentZoom.value = zoom
	emits('update:zoom', zoom)
}

async function handleRotate() {
	if (!cropperRef.value) return

	const nextRotation = (rotation.value + 90) % 360
	await restoreFullImage(nextRotation)
	rotation.value = nextRotation
	emits('rotate')
}

async function handleReset() {
	if (!cropperRef.value) return

	await restoreFullImage(0)
	rotation.value = 0
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
			:disabled-reset="currentZoom === 0 && rotation === 0"
			@reset="handleReset"
			@cancel="handleCancel"
			@apply="handleApply"
		/>
		<slot />
	</div>
</template>
