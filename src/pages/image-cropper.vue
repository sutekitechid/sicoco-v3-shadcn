<template>
	<div class="flex max-w-4xl flex-col gap-8 p-4 sm:p-6">
		<div>
			<h2 class="text-2xl font-semibold text-main">Image Cropper</h2>
			<p class="text-main">
				Komponen untuk memotong dan mengatur gambar dengan fitur zoom, reset, dan
				aksi apply/cancel.
			</p>
		</div>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Basic Usage</h3>
			<p class="mb-4 text-sm text-main">
				Image cropper dengan bentuk square dan zoom slider. Drag handles untuk mengatur area crop.
			</p>
			<div class="flex justify-center">
				<ImageCropper
					src="https://images.unsplash.com/photo-1600984575359-310ae7b6bdf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
					:aspect-ratio="1"
					shape="square"
					@apply="handleApply"
					@cancel="handleCancel"
					@reset="handleReset"
				/>
			</div>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">With Dialog Wrapper</h3>
			<p class="mb-4 text-sm text-main">
				Image cropper yang dibungkus dalam dialog modal.
			</p>
			<Button @click="isDialogOpen = true">Buka Cropper di Dialog</Button>

			<Dialog v-model:open="isDialogOpen" size="md">
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Atur Logo Perguruan Tinggi</DialogTitle>
					</DialogHeader>
					<div class="px-5 w-150">
						<ImageCropper
							src="https://images.unsplash.com/photo-1600984575359-310ae7b6bdf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
							:aspect-ratio="1"
							shape="square"
							@apply="handleApplyDialog"
							@cancel="isDialogOpen = false"
							@reset="handleReset"
						/>
					</div>
				</DialogContent>
			</Dialog>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Circle Shape</h3>
			<p class="mb-4 text-sm text-main">
				Image cropper dengan bentuk lingkaran untuk avatar.
			</p>
			<div class="flex justify-center">
				<ImageCropper
					src="https://images.unsplash.com/photo-1600984575359-310ae7b6bdf2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
					:aspect-ratio="1"
					shape="circle"
					@apply="handleApplyCircle"
					@cancel="handleCancel"
					@reset="handleReset"
				/>
			</div>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Events</h3>
			<div class="mt-2 flex flex-col gap-2">
				<p v-if="lastEvent" class="text-sm text-success-default">
					{{ lastEvent }}
				</p>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
	ImageCropper,
} from '@/components/image-cropper'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/dialog'
import Button from '@/components/button/Button.vue'

const isDialogOpen = ref(false)
const lastEvent = ref('')

function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png', quality = 0.92): Promise<Blob> {
	return new Promise((resolve) => {
		canvas.toBlob((blob) => resolve(blob!), type, quality)
	})
}

async function handleApply(coordinates: { left: number; top: number; width: number; height: number }, canvas: HTMLCanvasElement) {
	const blob = await canvasToBlob(canvas)
	console.log('Cropped blob:', blob)
	console.log('Coordinates:', coordinates)

	const formData = new FormData()
	formData.append('image', blob, 'crop.png')

	// Example: send to backend
	// await fetch('/api/upload', { method: 'POST', body: formData })

	lastEvent.value = `Apply: ${Math.round(coordinates.width)}x${Math.round(coordinates.height)} — blob size: ${(blob.size / 1024).toFixed(1)}KB`
}

async function handleApplyDialog(coordinates: { left: number; top: number; width: number; height: number }, canvas: HTMLCanvasElement) {
	const blob = await canvasToBlob(canvas)
	console.log('Cropped blob from dialog:', blob)

	lastEvent.value = `Apply from dialog: ${Math.round(coordinates.width)}x${Math.round(coordinates.height)} — blob size: ${(blob.size / 1024).toFixed(1)}KB`
	isDialogOpen.value = false
}

async function handleApplyCircle(coordinates: { left: number; top: number; width: number; height: number }, canvas: HTMLCanvasElement) {
	const blob = await canvasToBlob(canvas, 'image/png')
	console.log('Cropped circle blob:', blob)

	lastEvent.value = `Apply circle: ${Math.round(coordinates.width)}x${Math.round(coordinates.height)} — blob size: ${(blob.size / 1024).toFixed(1)}KB`
}

function handleCancel() {
	lastEvent.value = 'Cancel clicked'
}

function handleReset() {
	lastEvent.value = 'Reset clicked'
}
</script>
