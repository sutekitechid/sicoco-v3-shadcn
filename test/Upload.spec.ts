import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import Upload from '../lib/components/upload/Upload.vue'
import UploadDeleteButton from '../lib/components/upload/UploadDeleteButton.vue'
import UploadFailure from '../lib/components/upload/UploadFailure.vue'
import UploadFileItem from '../lib/components/upload/UploadFileItem.vue'
import UploadFileList from '../lib/components/upload/UploadFileList.vue'
import UploadViewButton from '../lib/components/upload/UploadViewButton.vue'
import FormInput from '../lib/components/form-input/FormInput.vue'
import { checkMaxSize, uploadVariants } from '../lib/components/upload/index'

test('Upload component should render', () => {
	const wrapper = mount(Upload)
	expect(wrapper.find('input[type="file"]').exists()).toBe(true)
})

test('Upload shows loading state before failed or selected states', () => {
	const file = new File(['file'], 'document.pdf', { type: 'application/pdf' })
	const wrapper = mount(Upload, {
		props: { loading: true, uploadFailed: true, modelValue: file },
	})

	expect(wrapper.text()).toContain('Mengunggah...')
	expect(wrapper.text()).not.toContain('Gagal mengunggah berkas')
	expect(wrapper.text()).not.toContain('document.pdf')
	expect(wrapper.get('input[type="file"]').attributes('disabled')).toBeDefined()
})

test('Upload file should be required', async () => {
	const wrapper = mount(FormInput, {
		slots: {
			default: `<Upload label="upload file" required>
                <template #required>Wajib diisi</template>
            </Upload>
            <button type="submit">Submit</button>
            `,
		},
		global: {
			stubs: {
				Upload,
			},
		},
	})
	const submitButton = wrapper.find('button')
	await submitButton.trigger('click')
	expect(wrapper.html()).toContain('Wajib diisi')
})

test('Upload file should have danger border when invalid', () => {
	expect(uploadVariants({ invalid: true })).toContain('border-danger-default!')
})

test('Upload selected state has no outer padding or gap', () => {
	const classes = uploadVariants({ state: 'selected' })
	expect(classes).toContain('p-0')
	expect(classes).toContain('gap-0')
})

test('Upload file can validate custom validation', async () => {
	const wrapper = mount(FormInput, {
		slots: {
			default: `<Upload label="upload file" :custom-validators="{ test: value => value === 'test' }">
                <template #errors="{ validation }">
                    <span v-if="validation.test">Test harus diisi</span>
                </template>
            </Upload>
            
            <button type="submit">Submit</button>
            `,
		},
		global: {
			stubs: {
				Upload,
			},
		},
	})
	const submitButton = wrapper.find('button')
	await submitButton.trigger('click')
	expect(wrapper.html()).toContain('Test harus diisi')
})

test('Upload file should be disabled', () => {
	const wrapper = mount(Upload, {
		props: {
			disabled: true,
			label: 'Upload file',
		},
	})

	expect(wrapper.html()).toContain('disabled')
})

test('Upload file should show uploaded filename', async () => {
	const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
	const wrapper = mount(Upload, {
		props: {
			modelValue: file,
			label: 'Upload file',
		},
	})
	expect(wrapper.html()).toContain('chucknorris.png')
})

test('Upload file includes a view action', () => {
	const file = new File(['file'], 'document.pdf', { type: 'application/pdf' })
	const wrapper = mount(Upload, {
		props: { modelValue: file },
	})

	expect(wrapper.get('[aria-label="Lihat document.pdf"]').find('.si-heroicon-solid-eye').exists()).toBe(true)
})

test('Upload renders a string URL model value as a file', () => {
	const url = 'https://example.com/documents/document.pdf'
	const wrapper = mount(Upload, {
		props: {
			modelValue: url,
			fileMetadata: {
				[url]: { name: 'Dokumen.pdf', size: 1_048_576, type: 'application/pdf' },
			},
		},
	})

	expect(wrapper.text()).toContain('Dokumen.pdf')
	expect(wrapper.text()).toContain('1.0MB')
	expect(wrapper.get(`[aria-label="Lihat ${url}"]`).exists()).toBe(true)
})

test('Upload exposes a scoped slot for file details', () => {
	const file = new File(['file'], 'document.pdf', { type: 'application/pdf' })
	const wrapper = mount(Upload, {
		props: { modelValue: file },
		slots: { 'file-detail': '<span>Detail kustom</span>' },
	})

	expect(wrapper.text()).toContain('Detail kustom')
})

test('Upload emits view with the selected file', async () => {
	const file = new File(['file'], 'document.pdf', { type: 'application/pdf' })
	const wrapper = mount(Upload, {
		props: { modelValue: file },
	})

	await wrapper.get('[aria-label="Lihat document.pdf"]').trigger('click')
	expect(wrapper.emitted('view')).toEqual([[file]])
})

test('Upload file can be cleared', async () => {
	const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
	const wrapper = mount(Upload, {
		props: {
			modelValue: file,
			label: 'Upload file',
		},
	})
	const clearButton = wrapper.get('[aria-label="Hapus chucknorris.png"]')
	await clearButton.trigger('click')
	expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
})

test('Upload delete button uses an outlined main button', () => {
	const wrapper = mount(UploadDeleteButton, {
		props: { dataCy: 'upload' },
	})

	const button = wrapper.get('[data-cy="upload-file-delete-button"]')
	expect(button.classes()).toContain('border-main')
	expect(button.classes()).toContain('text-main')
})

test('Upload view button uses the eye icon', () => {
	const wrapper = mount(UploadViewButton, {
		props: { dataCy: 'upload' },
	})

	expect(wrapper.get('[data-cy="upload-file-view-button"]').find('.si-heroicon-solid-eye').exists()).toBe(true)
})

test('Upload failure emits its action events', async () => {
	const wrapper = mount(UploadFailure, {
		props: { title: 'Gagal', description: 'Coba lagi' },
	})

	await wrapper.get('button:first-of-type').trigger('click')
	await wrapper.get('button:nth-of-type(2)').trigger('click')
	expect(wrapper.emitted('back')).toHaveLength(1)
	expect(wrapper.emitted('retry')).toHaveLength(1)
})

test('Upload file list emits file actions', async () => {
	const file = new File(['file'], 'document.pdf', { type: 'application/pdf' })
	const wrapper = mount(UploadFileList, {
		props: { files: [file], multiple: true, canEdit: true },
	})

	await wrapper.get('[aria-label="Lihat document.pdf"]').trigger('click')
	await wrapper.get('[aria-label="Hapus document.pdf"]').trigger('click')
	await wrapper.findAll('button').find(button => button.text() === 'Tambah Berkas')?.trigger('click')
	expect(wrapper.find('.max-h-80').classes()).toContain('w-full')
	expect(wrapper.find('.sticky.bottom-0').classes()).toContain('w-full')
	expect(wrapper.emitted('view')).toEqual([[file]])
	expect(wrapper.emitted('delete')).toEqual([[0]])
	expect(wrapper.emitted('add')).toHaveLength(1)
})

test('Upload file item renders action slot content', () => {
	const file = new File(['file'], 'document.pdf', { type: 'application/pdf' })
	const wrapper = mount(UploadFileItem, {
		props: { file },
		slots: { actions: '<button type="button">Remove</button>' },
	})

	expect(wrapper.text()).toContain('document.pdf')
	expect(wrapper.text()).toContain('Remove')
})

test('Upload file should show appropriate label', () => {
	const wrapper = mount(Upload, {
		props: {
			label: 'Upload file',
		},
	})
	expect(wrapper.html()).toContain('Upload file')
})

test('Check max file size: fail', () => {
	const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
	expect(checkMaxSize(file, 1)).toBe(false)
})
test('Check max file size: success', () => {
	const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
	expect(checkMaxSize(file, 1000)).toBe(true)
})

test('Upload renders the Figma dropzone when no default slot is provided', () => {
	const wrapper = mount(Upload)

	expect(wrapper.text()).toContain('Seret atau')
	expect(wrapper.text()).toContain('pilih berkas')
	expect(wrapper.text()).toContain('Format: JPEG, PNG, PDF, MP4, dan ZIP dengan maksimal 50 MB')
	expect(wrapper.find('[role="button"]').classes()).toContain('min-h-36')
})

test('Upload preserves custom default slot content', () => {
	const wrapper = mount(Upload, {
		slots: {
			default: '<span>Custom uploader</span>',
		},
	})

	expect(wrapper.text()).toContain('Custom uploader')
	expect(wrapper.text()).not.toContain('Seret atau')
})

test('Upload emits selected file from the native picker', async () => {
	const file = new File(['file'], 'document.pdf', { type: 'application/pdf' })
	const wrapper = mount(Upload)
	const input = wrapper.find('input[type="file"]')
	Object.defineProperty(input.element, 'files', { value: [file] })

	await input.trigger('change')

	expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([file])
})

test('Upload appends files in multiple mode and replaces them on reupload', async () => {
	const firstFile = new File(['first'], 'first.pdf', { type: 'application/pdf' })
	const secondFile = new File(['second'], 'second.pdf', { type: 'application/pdf' })
	const replacement = new File(['replacement'], 'replacement.pdf', { type: 'application/pdf' })
	const wrapper = mount(Upload, {
		props: {
			modelValue: [firstFile],
			multiple: true,
		},
		global: {
			stubs: { RouterLink: true },
		},
	})

	const buttons = wrapper.findAll('button')
	await buttons.find(button => button.text() === 'Tambah Berkas')?.trigger('click')
	const input = wrapper.find('input[type="file"]')
	Object.defineProperty(input.element, 'files', { value: [secondFile], configurable: true })
	await input.trigger('change')
	expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[firstFile, secondFile]])

	await buttons.find(button => button.text() === 'Unggah Ulang')?.trigger('click')
	Object.defineProperty(input.element, 'files', { value: [replacement], configurable: true })
	await input.trigger('change')
	expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[replacement]])
})

test('Upload separates the scrollable file list from upload actions', () => {
	const file = new File(['file'], 'document.pdf', { type: 'application/pdf' })
	const wrapper = mount(Upload, {
		props: { modelValue: [file], multiple: true },
	})

	expect(wrapper.find('.max-h-80.overflow-y-auto').exists()).toBe(true)
	expect(wrapper.find('.sticky.bottom-0').text()).toContain('Tambah Berkas')
})

test('Upload accepts file drops and exposes dragging state', async () => {
	const file = new File(['file'], 'dropped.pdf', { type: 'application/pdf' })
	const wrapper = mount(Upload)
	const dropzone = wrapper.get('[role="button"]')
	const dataTransfer = { files: [file], types: ['Files'] }

	await dropzone.trigger('dragenter', { dataTransfer })
	expect(dropzone.classes()).toContain('bg-primary-subtle')
	await dropzone.trigger('drop', { dataTransfer })

	expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([file])
})

test('Upload ignores drops when readonly', async () => {
	const file = new File(['file'], 'readonly.pdf', { type: 'application/pdf' })
	const wrapper = mount(Upload, { props: { readonly: true } })

	await wrapper.get('[role="button"]').trigger('drop', {
		dataTransfer: { files: [file], types: ['Files'] },
	})

	expect(wrapper.emitted('update:modelValue')).toBeUndefined()
})

test('Upload renders failure state and emits failure actions', async () => {
	const wrapper = mount(Upload, {
		props: { uploadFailed: true },
		global: {
			stubs: { RouterLink: true },
		},
	})

	expect(wrapper.text()).toContain('Gagal mengunggah berkas')
	expect(wrapper.text()).toContain('Ukuran berkas terlalu besar atau format tidak didukung')
	expect(wrapper.find('.sticky.bottom-0').text()).toContain('Coba Lagi')
	await wrapper.get('button:first-of-type').trigger('click')
	await wrapper.get('button:nth-of-type(2)').trigger('click')
	expect(wrapper.emitted('back')).toHaveLength(1)
	expect(wrapper.emitted('retry')).toHaveLength(1)
})
