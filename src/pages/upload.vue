<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/button'
import { FormInput } from '@/components/form-input'
import { Upload } from '@/components/upload'
import type { UploadFile, UploadItem } from '@/components/upload'

const singleFile = ref<File | null>(null)
const multipleFiles = ref<File[]>([])
const validationFile = ref<File | null>(null)
const fileUrl = ref<string | null>('https://example.com/documents/panduan-pengguna.pdf')
const fileMetadata = {
	'https://example.com/documents/panduan-pengguna.pdf': {
		name: 'Panduan Pengguna.pdf',
		size: 1_048_576,
		type: 'application/pdf',
	},
}
const loadingUpload = ref(true)
const failedUpload = ref(true)
const submitResult = ref('')
const viewedFile = ref<File | string | null>(null)
const deletedFile = ref<UploadFile | null>(null)
const partialUploadItems = ref<UploadItem[]>([
	{
		id: 'identity-card',
		file: new File(['identity-card'], 'KTP.pdf', { type: 'application/pdf' }),
		status: 'success',
	},
	{
		id: 'family-card',
		file: new File(['family-card'], 'Kartu Keluarga.pdf', { type: 'application/pdf' }),
		status: 'failed',
		error: 'Koneksi terputus. Periksa koneksi lalu coba lagi.',
	},
	{
		id: 'tax-card',
		file: new File(['tax-card'], 'NPWP.pdf', { type: 'application/pdf' }),
		status: 'uploading',
	},
])

function logUploadEvent(eventName: string, ...payload: unknown[]) {
	console.log(`[Upload] ${eventName}`, ...payload)
}

function handleSubmit(valid: boolean) {
	if (!valid) {
		submitResult.value = 'Form belum valid. Periksa berkas yang dipilih.'
		return
	}

	submitResult.value = `Berkas ${validationFile.value?.name} siap diunggah.`
}

function retryUpload() {
	logUploadEvent('retry')
	failedUpload.value = false
}

function resetFailedUpload() {
	logUploadEvent('back')
	failedUpload.value = true
}

function handleView(file: File | string) {
	logUploadEvent('view', file)
	viewedFile.value = file
}

function handleDelete(file: UploadFile, index: number) {
	logUploadEvent('delete', file, index)
	deletedFile.value = file
}

function retryPartialUpload(item: UploadItem) {
	logUploadEvent('retry', item)
	updatePartialUploadItem(item.id, { status: 'uploading', error: undefined })
	setTimeout(() => updatePartialUploadItem(item.id, { status: 'success' }), 1000)
}

function updatePartialUploadItem(id: string, update: Partial<UploadItem>) {
	partialUploadItems.value = partialUploadItems.value.map(item => item.id === id ? { ...item, ...update } : item)
}

function toggleLoading() {
	loadingUpload.value = !loadingUpload.value
}
</script>

<template>
	<div class="mx-auto flex max-w-5xl flex-col gap-8 p-4 tablet:p-8">
		<header class="max-w-2xl">
			<h1 class="text-heading-sm font-semibold text-main">Upload</h1>
			<p class="mt-2 text-body-md text-neutral-600">
				Unggah berkas dengan klik, keyboard, atau drag and drop.
			</p>
		</header>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Berkas Tunggal</h2>
			<div class="mt-5 max-w-xl">
				<Upload
					v-model="singleFile"
					label="Seret dokumen atau"
					description="Format: PDF, DOC, DOCX dengan maksimal 5 MB"
					:file-types="['application/pdf', '.doc', '.docx']"
					:max-size="5 * 1024 * 1024"
					data-cy="upload-single"
					@update:model-value="logUploadEvent('update:modelValue', $event)"
					@view="handleView"
					@delete="handleDelete"
				/>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Loading</h2>
			<div class="mt-5 max-w-xl">
				<Upload
					:loading="loadingUpload"
					data-cy="upload-loading"
					@back="logUploadEvent('back')"
					@retry="logUploadEvent('retry')"
					@view="handleView"
					@delete="handleDelete"
				/>
			</div>
			<Button type="button" class="mt-4" variant="secondary-primary" @click="toggleLoading">
				{{ loadingUpload ? 'Selesai Memuat' : 'Tampilkan Loading' }}
			</Button>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">URL Berkas</h2>
			<p class="mt-2 text-body-md text-neutral-600">
				Gunakan URL yang telah tersimpan dari server sebagai nilai model.
			</p>
			<div class="mt-5 max-w-xl">
				<Upload
					v-model="fileUrl"
					:file-metadata="fileMetadata"
					description="Berkas dari URL dapat dilihat atau dihapus."
					data-cy="upload-url"
					@update:model-value="logUploadEvent('update:modelValue', $event)"
					@view="handleView"
					@delete="handleDelete"
				/>
			</div>
			<p class="mt-3 break-all text-label-md text-secondary">
				Model value: {{ fileUrl || '(kosong)' }}
			</p>
			<p v-if="viewedFile" class="mt-2 break-all text-label-md text-success-700">
				View event: {{ typeof viewedFile === 'string' ? viewedFile : viewedFile.name }}
			</p>
			<p v-if="deletedFile" class="mt-2 text-label-md text-danger-default">
				Delete event: {{ typeof deletedFile === 'string' ? deletedFile : deletedFile.name }}
			</p>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Beberapa Berkas</h2>
			<div class="mt-5 max-w-xl">
				<Upload
					v-model="multipleFiles"
					multiple
					description="Format: JPEG dan PNG dengan maksimal 2 MB per berkas"
					:file-types="['image/jpeg', 'image/png', 'pdf']"
					:max-size="2 * 1024 * 1024"
					data-cy="upload-multiple"
					add-label="Tambah Berkas Lagi"
					replace-label="Ganti Semua Berkas"
					@update:model-value="logUploadEvent('update:modelValue', $event)"
					@view="handleView"
					@delete="handleDelete"
				/>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Sebagian Berkas Gagal</h2>
			<p class="mt-2 text-body-md text-secondary">
				Status berada pada setiap berkas. Berkas yang sukses tetap tersedia dan hanya berkas gagal yang diunggah ulang.
			</p>
			<div class="mt-5 max-w-xl">
				<Upload
					v-model:items="partialUploadItems"
					multiple
					description="PDF dengan maksimal 2 MB per berkas"
					:file-types="['application/pdf']"
					:max-size="2 * 1024 * 1024"
					data-cy="upload-partial-failure"
					replace-label="Ganti Semua Berkas"
					@update:items="logUploadEvent('update:items', $event)"
					@view="handleView"
					@delete="handleDelete"
					@retry="retryPartialUpload"
				/>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Validasi Form</h2>
			<p class="mt-2 text-body-md text-neutral-600">
				Pilih PDF hingga 1 MB, lalu klik Kirim untuk memvalidasi.
			</p>
			<FormInput class="mt-5 max-w-xl" @submit="handleSubmit">
				<Upload
					v-model="validationFile"
					required
					description="Format: PDF dengan maksimal 1 MB"
					:file-types="['application/pdf']"
					:max-size="1024 * 1024"
					data-cy="upload-validation"
					@update:model-value="logUploadEvent('update:modelValue', $event)"
					@view="handleView"
					@delete="handleDelete"
					@back="logUploadEvent('back')"
					@retry="logUploadEvent('retry')"
				>
					<template #required>Pilih berkas terlebih dahulu.</template>
					<template #maxSize>Ukuran berkas maksimal 1 MB.</template>
					<template #fileType>Hanya berkas PDF yang diperbolehkan.</template>
				</Upload>
				<Button type="submit" class="mt-4">Kirim</Button>
			</FormInput>
			<p v-if="submitResult" class="mt-3 text-label-md text-success-700">
				{{ submitResult }}
			</p>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Status Gagal</h2>
			<div class="mt-5 max-w-xl">
				<Upload
					:upload-failed="failedUpload"
					@back="resetFailedUpload"
					@retry="retryUpload"
				/>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Disabled dan Read-only</h2>
			<div class="mt-5 grid max-w-3xl gap-5 md:grid-cols-2">
				<Upload disabled description="Unggah berkas sedang tidak tersedia." />
				<Upload :model-value="singleFile" readonly description="Berkas hanya dapat dilihat." />
			</div>
		</section>
	</div>
</template>
