<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from '@/components/upload'

const basicFile = ref<File>()
const requiredFile = ref<File>()
const imageFile = ref<File>()
const disabledFile = ref<File>()
const readonlyFile = ref<File>()
const customFile = ref<File>()

const imageTypes = ['image/png', 'image/jpeg', 'image/webp']
const documentTypes = ['application/pdf']
</script>

<template>
	<div class="mx-auto flex max-w-5xl flex-col gap-8 p-4 tablet:p-8">
		<header class="max-w-2xl">
			<h1 class="text-heading-sm font-semibold text-main">Upload</h1>
			<p class="mt-2 text-body-md text-neutral-600">
				Pilih file dengan dukungan validasi ukuran, tipe file, dan status input.
			</p>
		</header>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Basic</h2>
			<p class="mt-2 text-body-sm text-neutral-600">
				Upload file sederhana menggunakan <code>v-model</code>.
			</p>
			<div class="mt-5 max-w-xl">
				<Upload v-model="basicFile" label="Pilih file" />
				<p v-if="basicFile" class="mt-2 text-body-sm text-neutral-600">
					File terpilih: {{ basicFile.name }}
				</p>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Required</h2>
			<p class="mt-2 text-body-sm text-neutral-600">
				Klik area upload lalu submit form tanpa memilih file untuk melihat validasi.
			</p>
			<form class="mt-5 flex max-w-xl flex-col gap-3" @submit.prevent>
				<Upload v-model="requiredFile" label="Dokumen wajib" required>
					<template #required>Dokumen wajib diunggah.</template>
				</Upload>
				<button
					type="submit"
					class="w-fit rounded-md bg-primary-default px-4 py-2 text-label-md font-semibold text-white hover:bg-primary-hover"
				>
					Submit
				</button>
			</form>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">File Type and Size</h2>
			<p class="mt-2 text-body-sm text-neutral-600">
				Contoh ini hanya menerima PNG, JPEG, atau WebP dengan ukuran maksimal 2 MB.
			</p>
			<div class="mt-5 max-w-xl">
				<Upload
					v-model="imageFile"
					label="Upload gambar"
					:max-size="2 * 1024 * 1024"
					:file-types="imageTypes"
				>
					<template #maxSize>Ukuran file maksimal 2 MB.</template>
					<template #fileType>Gunakan file PNG, JPEG, atau WebP.</template>
				</Upload>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Custom Label and Errors</h2>
			<p class="mt-2 text-body-sm text-neutral-600">
				Gunakan slot untuk mengubah label dan pesan validasi upload.
			</p>
			<div class="mt-5 max-w-xl">
				<Upload
					v-model="customFile"
					:max-size="1024 * 1024"
					:file-types="documentTypes"
				>
					<template #label>
						<div class="flex items-center gap-3 font-semibold">
							<i class="si-document text-primary-default" />
							<span>Upload dokumen PDF</span>
						</div>
					</template>
					<template #maxSize>Dokumen tidak boleh lebih besar dari 1 MB.</template>
					<template #fileType>Format yang didukung hanya PDF.</template>
				</Upload>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Disabled and Readonly</h2>
			<p class="mt-2 text-body-sm text-neutral-600">
				Input disabled tidak dapat dipilih, sedangkan readonly menampilkan file tanpa tombol hapus.
			</p>
			<div class="mt-5 grid max-w-3xl gap-5 md:grid-cols-2">
				<Upload v-model="disabledFile" label="Upload disabled" disabled />
				<Upload v-model="readonlyFile" label="Upload readonly" readonly />
			</div>
		</section>
	</div>
</template>
