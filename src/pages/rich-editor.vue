<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">Default</h3>
			<p class="text-sm text-neutral-500 mb-2">
				State standar, editor dapat menerima input.
			</p>
			<SRichTextEditor
				v-model="defaultValue"
				:image-upload-handler="uploadImageMock"
				:video-upload-handler="uploadImageMock"
				:attachment-upload-handler="uploadImageMock"
				placeholder="Tulis di sini..."
				data-cy="rich-editor-default"
				data-testid="rich-editor-default"
			/>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Disabled</h3>
			<p class="text-sm text-neutral-500 mb-2">
				Editor tidak dapat menerima input (background disabled).
			</p>
			<SRichTextEditor
				v-model="disabledValue"
				disabled
				:image-upload-handler="uploadImageMock"
				:video-upload-handler="uploadImageMock"
				:attachment-upload-handler="uploadImageMock"
				placeholder="Disabled editor"
				data-cy="rich-editor-disabled"
				data-testid="rich-editor-disabled"
			/>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Readonly</h3>
			<p class="text-sm text-neutral-500 mb-2">
				Editor tidak dapat menerima input baru, konten yang ada tetap
				ditampilkan.
			</p>
			<SRichTextEditor
				v-model="readonlyValue"
				readonly
				:image-upload-handler="uploadImageMock"
				:video-upload-handler="uploadImageMock"
				:attachment-upload-handler="uploadImageMock"
				data-cy="rich-editor-readonly"
				data-testid="rich-editor-readonly"
			/>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Custom Toolbar (toolbar-items)</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gunakan prop <code>toolbar-items</code> untuk whitelist tombol yang
				ditampilkan. Default-nya adalah semua item kecuali
				<code>'attachment'</code> (lihat
				<code>DEFAULT_RICH_EDITOR_TOOLBAR_ITEMS</code>).
			</p>

			<div class="flex flex-col gap-4">
				<div>
					<h4 class="font-medium text-sm mb-2">Minimal (Bold, Italic, Underline only)</h4>
					<SRichTextEditor
						v-model="customMinimalValue"
						:toolbar-items="['bold', 'italic', 'underline']"
						:image-upload-handler="uploadImageMock"
						:video-upload-handler="uploadImageMock"
						:attachment-upload-handler="uploadImageMock"
						placeholder="Toolbar minimal..."
						data-cy="rich-editor-toolbar-minimal"
						data-testid="rich-editor-toolbar-minimal"
					/>
				</div>

				<div class="mb-4">
					<h4 class="font-medium text-sm mb-2">
						Default (no attachment)
					</h4>
					<SRichTextEditor
						v-model="customDefaultValue"
						:image-upload-handler="uploadImageMock"
						:video-upload-handler="uploadImageMock"
						:attachment-upload-handler="uploadImageMock"
						placeholder="Default toolbar (attachment tidak ditampilkan)..."
						data-cy="rich-editor-toolbar-default"
						data-testid="rich-editor-toolbar-default"
					>
						<template #hint>
							<div class="flex gap-2 items-center">
								<i class="si-heroicon-solid-light-bulb"></i>
								Kamu bisa mengisi field ini dengan pengalaman terbaik kamu
							</div>
						</template>
					</SRichTextEditor>
				</div>

				<div>
					<h4 class="font-medium text-sm mb-2">Full + Attachment (override default)</h4>
					<SRichTextEditor
						v-model="customWithAttachmentValue"
						:toolbar-items="fullToolbarWithAttachment"
						:image-upload-handler="uploadImageMock"
						:video-upload-handler="uploadImageMock"
						:attachment-upload-handler="uploadImageMock"
						placeholder="Default + tombol attachment..."
						data-cy="rich-editor-toolbar-with-attachment"
						data-testid="rich-editor-toolbar-with-attachment"
					/>
				</div>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Invalid (with SFormInput)</h3>
			<p class="text-sm text-neutral-500 mb-2">
				Klik Submit tanpa mengisi konten untuk memunculkan state invalid.
			</p>
			<FormInput @submit="onValidSubmit">
				<SRichTextEditor
					v-model="invalidValue"
					required
					:image-upload-handler="uploadImageMock"
					:video-upload-handler="uploadImageMock"
					:attachment-upload-handler="uploadImageMock"
					placeholder="Tulis deskripsi..."
					data-cy="rich-editor-invalid"
					data-testid="rich-editor-invalid"
				>
					<template #required>
						<span class="text-danger-500 text-sm">Konten wajib diisi</span>
					</template>
					<template #hint>
						<div class="flex gap-2 items-center">
							<i class="si-heroicon-solid-light-bulb"></i>
							Kamu bisa mengisi field ini dengan pengalaman terbaik kamu
						</div>
					</template>
				</SRichTextEditor>
				<Button type="submit" data-cy="rich-editor-submit" data-testid="rich-editor-submit" class="mt-4">
					Submit
				</Button>
			</FormInput>
			<p
				v-if="lastSubmitResult"
				class="text-sm text-success-700 mt-2"
				data-cy="rich-editor-submit-result"
				data-testid="rich-editor-submit-result"
			>
				{{ lastSubmitResult }}
			</p>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/button/Button.vue'
import SRichTextEditor from '@/components/rich-editor/RichTextEditor.vue'
import { DEFAULT_RICH_EDITOR_TOOLBAR_ITEMS, type RichEditorToolbarItem } from '@/components/rich-editor'
import { FormInput } from '@/components/form-input'

const defaultValue = ref<string>('')
const disabledValue = ref<string>('')
const readonlyValue = ref<string>('<p>Konten ini <strong>readonly</strong>, tidak bisa diedit.</p>')
const invalidValue = ref<string>('')
const customMinimalValue = ref<string>('')
const customDefaultValue = ref<string>('')
const customWithAttachmentValue = ref<string>('')
const lastSubmitResult = ref('')

const fullToolbarWithAttachment: RichEditorToolbarItem[] = [
	...DEFAULT_RICH_EDITOR_TOOLBAR_ITEMS,
	'image',
	'video',
	'attachment',
]

function uploadImageMock(file: File): Promise<string> {
	return new Promise(resolve => {
		setTimeout(() => {
			console.log('uploading mock file:', file.name)
			resolve(
				'https://images.unsplash.com/photo-1742943892627-f7e4ddf91224?q=80&w=2069&auto=format&fit=crop'
			)
		}, 1000)
	})
}

function onValidSubmit(valid: boolean) {
	lastSubmitResult.value = valid
		? `Form valid! Konten: ${invalidValue.value.substring(0, 50)}...`
		: 'Form invalid, isi konten rich editor terlebih dahulu'
}
</script>
