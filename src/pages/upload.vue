<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/button'
import { FormInput } from '@/components/form-input'
import { Upload } from '@/components/upload'

const singleFile = ref<File | null>(null)
const multipleFiles = ref<File[]>([])
const validationFile = ref<File | null>(null)
const fileUrl = ref<string | null>(
	'https://example.com/documents/panduan-pengguna.pdf',
)
const optionalEditFileUrl = ref<string | null>(
	'https://example.com/documents/panduan-pengguna.pdf',
)
const fileMetadata = {
	'https://example.com/documents/panduan-pengguna.pdf': {
		name: 'Panduan Pengguna.pdf',
		size: 1_048_576,
		type: 'application/pdf',
	},
}
const loadingUpload = ref(true)
const failedUpload = ref(true)
const partialFailureFiles = ref<File[]>([])
const partialFailedFiles = ref<File[]>([])
const partialRetryingFiles = ref<File[]>([])
const partialSubmitting = ref(false)
const hasSubmittedPartialUpload = ref(false)
const submitResult = ref('')
const viewedFile = ref<File | string | null>(null)
const downloadedFile = ref<File | string | null>(null)

function handleSubmit(valid: boolean) {
	if (!valid) {
		submitResult.value = 'Form belum valid. Periksa berkas yang dipilih.'
		return
	}

	submitResult.value = `Berkas ${validationFile.value?.name} siap diunggah.`
}

function retryUpload() {
	failedUpload.value = false
}

function resetFailedUpload() {
	failedUpload.value = true
}

async function fakeUpload(files: File[]) {
	await new Promise(resolve => window.setTimeout(resolve, 600))
	return files.filter(file => file.name.toLowerCase().endsWith('.zip'))
}

async function simulatePartialUpload(files = partialFailureFiles.value) {
	const failedFiles = await fakeUpload(files)
	partialFailedFiles.value = partialFailureFiles.value.filter(
		file =>
			failedFiles.includes(file) ||
			(!files.includes(file) && partialFailedFiles.value.includes(file)),
	)
}

function handlePartialFiles(value: File | File[] | string | string[] | null) {
	const files = (Array.isArray(value) ? value : [value]).filter(
		(file): file is File => file instanceof File,
	)
	partialFailureFiles.value = files
	partialFailedFiles.value = []
	hasSubmittedPartialUpload.value = false
}

async function submitPartialUpload() {
	if (!partialFailureFiles.value.length) return
	partialSubmitting.value = true
	partialFailedFiles.value = []
	hasSubmittedPartialUpload.value = true
	try {
		await simulatePartialUpload()
	} finally {
		partialSubmitting.value = false
	}
}

function retryPartialFile(file: File | string) {
	if (!(file instanceof File)) return
	void retryPartialUpload([file])
}

function retryPartialFiles() {
	void retryPartialUpload(partialFailedFiles.value)
}

async function retryPartialUpload(files: File[]) {
	partialRetryingFiles.value = files
	try {
		await simulatePartialUpload(files)
	} finally {
		partialRetryingFiles.value = []
	}
}

function skipPartialFailures() {
	partialFailureFiles.value = partialFailureFiles.value.filter(
		file => !partialFailedFiles.value.includes(file),
	)
	partialFailedFiles.value = []
}

function handleView(file: File | string) {
	viewedFile.value = file
}

function handleDownload(file: File | string) {
	downloadedFile.value = file
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
				/>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Loading</h2>
			<div class="mt-5 max-w-xl">
				<Upload
					:loading="loadingUpload"
					data-cy="upload-loading"
				/>
			</div>
			<Button
				type="button"
				class="mt-4"
				variant="secondary-primary"
				@click="toggleLoading"
			>
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
					can-view
					can-download
					description="Berkas dari URL dapat dilihat, diunduh, atau dihapus."
					data-cy="upload-url"
					@download="handleDownload"
					@view="handleView"
				/>
			</div>
			<p class="mt-3 break-all text-label-md text-secondary">
				Model value: {{ fileUrl || '(kosong)' }}
			</p>
			<p
				v-if="viewedFile"
				class="mt-2 break-all text-label-md text-success-700"
			>
				View event:
				{{ typeof viewedFile === 'string' ? viewedFile : viewedFile.name }}
			</p>
			<p
				v-if="downloadedFile"
				class="mt-2 break-all text-label-md text-success-700"
			>
				Download event:
				{{
					typeof downloadedFile === 'string'
						? downloadedFile
						: downloadedFile.name
				}}
			</p>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Aksi Opsional</h2>
			<p class="mt-2 text-body-md text-neutral-600">
				Gunakan <code>can-edit</code>, <code>can-delete</code>,
				<code>can-view</code>, dan <code>can-download</code> untuk menampilkan
				hanya aksi yang diperlukan.
			</p>
			<div class="mt-5 grid max-w-5xl gap-5 lg:grid-cols-2">
				<div>
					<h3 class="text-label-lg font-semibold text-main">
						Edit tanpa hapus
					</h3>
					<Upload
						v-model="optionalEditFileUrl"
						:file-metadata="fileMetadata"
						can-edit
						:can-delete="false"
						:can-view="false"
					/>
				</div>
				<div>
					<h3 class="text-label-lg font-semibold text-main">Lihat saja</h3>
					<Upload
						:model-value="fileUrl"
						:file-metadata="fileMetadata"
						:can-edit="false"
						can-view
						readonly
					/>
				</div>
				<div>
					<h3 class="text-label-lg font-semibold text-main">Unduh saja</h3>
					<Upload
						:model-value="fileUrl"
						:file-metadata="fileMetadata"
						:can-edit="false"
						:can-view="false"
						can-download
						readonly
					/>
				</div>
				<div>
					<h3 class="text-label-lg font-semibold text-main">Tanpa aksi</h3>
					<Upload
						:model-value="fileUrl"
						:file-metadata="fileMetadata"
						:can-edit="false"
						:can-view="false"
						readonly
					/>
				</div>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white pt-5 px-5 pb-8">
			<h2 class="text-title-md font-semibold text-main">Beberapa Berkas</h2>
			<div class="mt-5 max-w-xl">
				<Upload
					v-model="multipleFiles"
					multiple
					description="Format: JPEG dan PNG dengan maksimal 2 MB per berkas"
					:file-types="['image/jpeg', 'image/png', 'pdf']"
					:max-size="2 * 1024 * 1024"
					data-cy="upload-multiple"
					add-label="Tambah Berkas"
					replace-label="Ungah Ulang"
				>
					<template #maxSize>Ukuran berkas maksimal 2 MB.</template>
					<template #fileType>Hanya berkas JPEG, PNG, dan PDF yang diperbolehkan.</template>
				</Upload>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Validasi Form</h2>
			<p class="mt-2 text-body-md text-neutral-600">
				Pilih PDF hingga 1 MB, lalu klik Kirim untuk memvalidasi.
			</p>
			<FormInput
				class="mt-5 max-w-xl"
				@submit="handleSubmit"
			>
				<Upload
					v-model="validationFile"
					required
					description="Format: PDF dengan maksimal 1 MB"
					:file-types="['application/pdf']"
					:max-size="1024 * 1024"
					data-cy="upload-validation"
				>
					<template #required>Pilih berkas terlebih dahulu.</template>
					<template #maxSize>Ukuran berkas maksimal 1 MB.</template>
					<template #fileType>Hanya berkas PDF yang diperbolehkan.</template>
				</Upload>
				<Button
					type="submit"
					class="mt-4"
					>Kirim</Button
				>
			</FormInput>
			<p
				v-if="submitResult"
				class="mt-3 text-label-md text-success-700"
			>
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
			<div class="border border-dashed p-4 mb-4 rounded-md">
				<h1 class="text-title-lg font-bold text-main">Karya Maul Finisher
					<a class="text-primary-main animate-pulse underline" href="https://www.strava.com/activities/20248799979/overview" target="_blank" rel="noopener noreferrer">21.1K</a>
				</h1>
			</div>
				<h2 class="text-title-md font-semibold text-main">Simulasi Upload Sebagian Gagal</h2>
			<p class="mt-2 text-body-md text-secondary">
				Pilih berkas, lalu unggah dengan tombol di bawah. API simulasi akan menolak berkas ZIP dan menerima format lainnya.
			</p>
			<div class="mt-5 max-w-xl">
				<Upload
					:model-value="partialFailureFiles"
					:failed-files="hasSubmittedPartialUpload ? partialFailedFiles : []"
					:retrying-files="partialRetryingFiles"
					multiple
					can-download
					data-cy="upload-partial-failure"
					@update:model-value="handlePartialFiles"
					@retry-file="retryPartialFile"
					@retry-failed="retryPartialFiles"
					@skip="skipPartialFailures"
				>
					<template #maxSize>Ukuran setiap berkas maksimal 50 MB.</template>
					<template #fileType>
						Format berkas harus JPEG, PNG, PDF, MP4, atau ZIP.
					</template>
				</Upload>
			</div>
			<Button
				type="button"
				class="mt-10"
				:disabled="!partialFailureFiles.length || partialSubmitting"
				@click="submitPartialUpload"
			>
				{{ partialSubmitting ? 'Mengunggah...' : 'Unggah Berkas' }}
			</Button>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">
				Disabled dan Read-only
			</h2>
			<div class="mt-5 grid max-w-3xl gap-5 md:grid-cols-2">
				<Upload
					disabled
					description="Unggah berkas sedang tidak tersedia."
				/>
			</div>
		</section>
	</div>
</template>
