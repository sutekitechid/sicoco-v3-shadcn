import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { nextTick } from 'vue'
import FormFilter from '../lib/components/form-filter/FormFilter.vue'

const iso = (day: string, ms: number) => `2026-09-${day}T00:00:00.${String(ms).padStart(3, '0')}Z`

const defaultFilter = (
	start = iso('10', 0),
	end = iso('10', 0)
) => ({
	action: undefined,
	actor: undefined,
	start,
	end,
})

const withExtras = (filter: Record<string, unknown>) => ({
	...filter,
	search: 'foo',
	page: 1,
	per_page: 10,
})

type Exposed = {
	filters: Record<string, unknown>
	dirty: boolean
	showReset: boolean
	applied: boolean
}

function mountForm(propsOverrides: Record<string, unknown> = {}) {
	return mount(FormFilter, {
		props: {
			initialFilter: defaultFilter(),
			currentFilter: withExtras(defaultFilter()),
			...propsOverrides,
		},
		slots: {
			default: `<template #default="{ dirty, showReset }">
				<div class="out"><span class="dirty">{{ dirty }}</span><span class="show-reset">{{ showReset }}</span></div>
			</template>`,
		},
	})
}

const getState = (wrapper: { vm: unknown }) => wrapper.vm as unknown as Exposed

test('mount tanpa perubahan (currentFilter == defaults + extra route keys) → dirty false, showReset false', () => {
	const wrapper = mountForm({ currentFilter: withExtras(defaultFilter()) })
	const state = getState(wrapper)
	expect(state.dirty).toBe(false)
	expect(state.showReset).toBe(false)
	expect(wrapper.find('.show-reset').text()).toBe('false')
})

test('reload-ISO: dua ISO string hari-sama tapi milidetik-beda → dirty false, showReset false', () => {
	const wrapper = mountForm({
		currentFilter: withExtras({
			...defaultFilter(iso('10', 0), iso('10', 0)),
			start: iso('10', 0),
			end: iso('10', 123),
		}),
	})
	const state = getState(wrapper)
	expect(state.dirty).toBe(false)
	expect(state.showReset).toBe(false)
})

test('user mengubah salah satu filter → dirty true, showReset true', async () => {
	const wrapper = mountForm()
	const state = getState(wrapper)
	state.filters = { ...state.filters, action: 'delete' }
	await nextTick()
	expect(state.dirty).toBe(true)
	expect(state.showReset).toBe(true)
})

test('klik apply tanpa perubahan → dirty false, showReset false, applied true, event apply emitted', async () => {
	const wrapper = mountForm()
	const state = getState(wrapper)
	state.onApply()
	await nextTick()
	expect(state.applied).toBe(true)
	expect(state.dirty).toBe(false)
	expect(state.showReset).toBe(false)
	expect(wrapper.emitted('apply')).toBeTruthy()
})

test('klik apply dengan perubahan → dirty false, showReset true, apply emitted', async () => {
	const wrapper = mountForm()
	const state = getState(wrapper)
	state.filters = { ...state.filters, action: 'update' }
	await nextTick()
	expect(state.dirty).toBe(true)
	state.onApply()
	await nextTick()
	expect(state.dirty).toBe(false)
	expect(state.showReset).toBe(true)
})

test('klik reset → dirty false, showReset false, event reset emitted', async () => {
	const wrapper = mountForm()
	const state = getState(wrapper)
	state.filters = { ...state.filters, action: 'delete' }
	await nextTick()
	state.onReset()
	await nextTick()
	expect(state.dirty).toBe(false)
	expect(state.showReset).toBe(false)
	expect(state.applied).toBe(false)
	expect(wrapper.emitted('reset')).toBeTruthy()
})

test('currentFilter route dengan filter non-default → dirty false, showReset true', () => {
	const wrapper = mountForm({
		currentFilter: withExtras({ ...defaultFilter(), action: 'login' }),
	})
	const state = getState(wrapper)
	expect(state.dirty).toBe(false)
	expect(state.showReset).toBe(true)
})

test('currentFilter berubah ke non-default dari luar → showReset true tanpa setDirty manual', async () => {
	const wrapper = mountForm()
	wrapper.setProps({ currentFilter: withExtras({ ...defaultFilter(), actor: 'x' }) })
	await nextTick()
	const state = getState(wrapper)
	expect(state.dirty).toBe(false)
	expect(state.showReset).toBe(true)
})

test('setelah apply, currentFilter yang dikembalikan parent tidak me-reset snapshot & sync berjalan lagi', async () => {
	const wrapper = mountFormWithSync()
	const state = getState(wrapper)
	state.filters = { ...state.filters, action: 'update' }
	await nextTick()
	state.onApply()
	await nextTick()
	// parent mengembalikan currentFilter sama dengan filter ter-apply
	wrapper.setProps({
		currentFilter: withExtras({ ...defaultFilter(), action: 'update' }),
	})
	await nextTick()
	expect(state.dirty).toBe(false)
	expect(state.showReset).toBe(true)
	// sync kembali aktif: perubahan dari luar yang jauh berbeda pasca-apply
	wrapper.setProps({
		currentFilter: withExtras({ ...defaultFilter(), action: 'update', actor: 'y' }),
	})
	await nextTick()
	expect(state.dirty).toBe(true)
})

function mountFormWithSync() {
	return mount(FormFilter, {
		props: {
			initialFilter: defaultFilter(),
			currentFilter: withExtras(defaultFilter()),
		},
	})
}

test('emits update:dirty & update:applied tetap bekerja', async () => {
	const wrapper = mountForm()
	await nextTick()
	// belum ada perubahan → tidak ada emit update:dirty
	expect(wrapper.emitted('update:dirty')).toBeUndefined()
	const state = getState(wrapper)
	state.filters = { ...state.filters, action: 'update' }
	await nextTick()
	expect(wrapper.emitted('update:dirty')?.at(-1)).toEqual([true])
	state.onApply()
	await nextTick()
	expect(wrapper.emitted('update:applied')?.at(-1)).toEqual([true])
	expect(wrapper.emitted('update:dirty')?.at(-1)).toEqual([false])
})

test('perbedaan tanggal lintas-hari tetap dianggap dirty', async () => {
	const wrapper = mountForm({
		currentFilter: withExtras({ ...defaultFilter(iso('10', 0), iso('11', 1)) }),
	})
	const state = getState(wrapper)
	state.filters = { ...state.filters, end: iso('10', 5) }
	await nextTick()
	expect(state.dirty).toBe(true)
})

test('slot prop show-reset ter-ekspor', () => {
	const wrapper = mountForm()
	expect(wrapper.find('.show-reset').exists()).toBe(true)
	expect(wrapper.find('.dirty').exists()).toBe(true)
})
