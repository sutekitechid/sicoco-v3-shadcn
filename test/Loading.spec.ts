import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Loading from '../lib/components/loading/Loading.vue'

test('Loading renders without crashing', () => {
	const wrapper = mount(Loading)
	expect(wrapper.exists()).toBe(true)
})

test('Loading is closed by default', () => {
	const wrapper = mount(Loading)
	// Dialog should not show the loader when loadingOpen is false
	expect(wrapper.find('.loader').exists()).toBe(false)
})

test('Loading opens when open() is called', async () => {
	const wrapper = mount(Loading)
	const vm = wrapper.vm as InstanceType<typeof Loading> & {
		open: () => unknown
		loadingOpen: boolean
	}
	vm.open()
	await wrapper.vm.$nextTick()
	expect(vm.loadingOpen).toBe(true)
})

test('Loading closes when close() is called after open()', async () => {
	const wrapper = mount(Loading)
	const vm = wrapper.vm as InstanceType<typeof Loading> & {
		open: () => unknown
		close: () => void
		loadingOpen: boolean
	}
	vm.open()
	await wrapper.vm.$nextTick()
	expect(vm.loadingOpen).toBe(true)

	vm.close()
	await wrapper.vm.$nextTick()
	expect(vm.loadingOpen).toBe(false)
})

test('Loading emits update:active with true when opened', async () => {
	const wrapper = mount(Loading)
	const vm = wrapper.vm as InstanceType<typeof Loading> & {
		open: () => unknown
	}
	vm.open()
	await wrapper.vm.$nextTick()
	expect(wrapper.emitted('update:active')).toBeTruthy()
	expect(wrapper.emitted('update:active')![0]).toEqual([true])
})

test('Loading emits update:active with false when closed', async () => {
	const wrapper = mount(Loading)
	const vm = wrapper.vm as InstanceType<typeof Loading> & {
		open: () => unknown
		close: () => void
	}
	vm.open()
	await wrapper.vm.$nextTick()
	vm.close()
	await wrapper.vm.$nextTick()
	const emitted = wrapper.emitted('update:active')!
	expect(emitted[emitted.length - 1]).toEqual([false])
})
