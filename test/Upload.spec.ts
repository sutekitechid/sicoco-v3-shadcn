import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

import Upload from '../lib/components/upload/Upload.vue'
import FormInput from '../lib/components/form-input/FormInput.vue'
import { checkMaxSize } from '../lib/components/upload/index'

test('Upload component should render', () => {
    const wrapper = mount(Upload)
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
})

test('Upload file should be required', () => {
    const wrapper = mount(FormInput, {
        slots: {
            default: `<Upload label="upload file" required>
                <template #required>Wajib diisi</template>
            </Upload>
            <button type="submit">Submit</button>
            `
        },
        global: {
            stubs: {
                Upload
            }
        }
    })
    const submitButton = wrapper.find('button')
    submitButton.trigger('click')
    expect(wrapper.html()).toContain('Wajib diisi')
})

test('Upload file should has danger border when invalid', async () => {
    const wrapper = mount(FormInput, {
        slots: {
            default: `<Upload label="upload file" required>
                <template #required>Wajib diisi</template>
            </Upload>
            <button type="submit">Submit</button>
            `
        },
        global: {
            stubs: {
                Upload
            }
        }
    })
    const submitButton = wrapper.find('button')
    await submitButton.trigger('click')
    setTimeout(() => {
        expect(wrapper.html()).toContain('!border-danger-100')
    }, 200)
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
            `
        },
        global: {
            stubs: {
                Upload
            }
        }
    })
    const submitButton = wrapper.find('button')
    await submitButton.trigger('click')
    expect(wrapper.html()).toContain('Test harus diisi')
})

// test('Upload file should validate max file size', async () => {
//     const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
//     const wrapper = mount(FormInput, {
//         slots: {
//             default: `<Upload :model-value="file" :max-size="1" label="upload file">
//                 <template #maxSize>File terlalu besar</template>
//             </Upload>
//             <button type="submit">Submit</button>
//             `
//         },
//         global: {
//             stubs: {
//                 Upload
//             }
//         }
//     })
//     const input = wrapper.find('input[type="file"]')
//     // const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
//     // await input.setValue([file])
//     const submitButton = wrapper.find('button')
//     await submitButton.trigger('click')
//     expect(wrapper.html()).toContain('File terlalu besar')
// })

test('Upload file should be disabled', () => {
    const wrapper = mount(Upload, {
        props: {
            disabled: true,
            label: 'Upload file'
        }
    })

    expect(wrapper.html()).toContain('disabled')
})

test('Upload file should show uploaded file', async () => {
    const wrapper = mount(Upload, {
        props: {
            label: 'Upload file'
        }
    })
    const input = wrapper.find('input[type="file"]')
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
    await input.setValue([file])
    expect(wrapper.html()).toContain('chucknorris.png')
})

test('Upload file can be cleared', async () => {
    const wrapper = mount(Upload, {
        props: {
            label: 'Upload file'
        }
    })
    const input = wrapper.find('input[type="file"]')
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
    await input.setValue([file])
    const clearButton = wrapper.find('button')
    await clearButton.trigger('click')
    expect(wrapper.html()).not.toContain('chucknorris.png')
})

test('Upload file can receive multiple files', async () => {
    const wrapper = mount(Upload, {
        props: {
            multiple: true,
            label: 'Upload file'
        }
    })
    const input = wrapper.find('input[type="file"]')
    const file1 = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
    const file2 = new File(['(⌐□_□)'], 'brucelee.png', { type: 'image/png' })
    await input.setValue([file1, file2])
    expect(wrapper.html()).toContain('chucknorris.png')
    expect(wrapper.html()).toContain('brucelee.png')
})

test('Upload file should show appropriate label', () => {
    const wrapper = mount(Upload, {
        props: {
            label: 'Upload file'
        }
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