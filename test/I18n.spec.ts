import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import {
	createComponentLibrary,
	useLibraryI18n,
	type TranslationAdapter,
} from '../lib/i18n'

test('throws an informative error when the i18n adapter is unavailable', () => {
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

	expect(useLibraryI18n).toThrow(
		'[Sicoco] i18n adapter is not installed. Register createComponentLibrary({ i18n }) with app.use().',
	)

	warn.mockRestore()
})

test('updates translated component text when the consumer locale changes', async () => {
	const locale = ref<'id' | 'en'>('id')
	const adapter: TranslationAdapter = {
		t() {
			return locale.value === 'id' ? 'Batal' : 'Cancel'
		},
	}
	const TranslationConsumer = defineComponent({
		setup() {
			const { t } = useLibraryI18n()
			return () => h('p', t('common.cancel'))
		},
	})

	const wrapper = mount(TranslationConsumer, {
		global: {
			plugins: [createComponentLibrary({ i18n: adapter })],
		},
	})

	expect(wrapper.text()).toBe('Batal')
	locale.value = 'en'
	await wrapper.vm.$nextTick()
	expect(wrapper.text()).toBe('Cancel')
})
