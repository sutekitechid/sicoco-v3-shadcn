import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import {
	determineModelValue,
	isChecked,
	Checkbox,
	CheckboxLabel,
	CheckboxGroup,
} from '../lib/components/checkbox'
import { FormInput } from '../lib/components/form-input'

test('Checkbox should be visible', () => {
	const wrapper = mount(Checkbox)
	expect(wrapper.isVisible()).toBe(true)
})

test('Checkbox should be checked when clicked', async () => {
	const wrapper = mount(Checkbox)
	const button = wrapper.find('button')
	await button.trigger('click')
	// find button with data-state="checked"
	expect(wrapper.html()).toContain('data-state="checked"')
})

test('Checkbox should be checked if label is clicked', async () => {
	const wrapper = mount(Checkbox, {
		slots: {
			default: 'Checkbox Label',
		},
	})
	const label = wrapper.find('label')
	// console.log('label', label)
	await label.trigger('click')
	// find button with data-state="checked"
	expect(wrapper.html()).toContain('data-state="checked"')
})

test('CheckboxLabel should be visible', () => {
	const wrapper = mount(CheckboxLabel)
	expect(wrapper.isVisible()).toBe(true)
})

test('CheckboxLabel should be visible with given slot', async () => {
	const wrapper = mount(CheckboxLabel, {
		slots: {
			default: 'Checkbox Label',
		},
	})
	expect(wrapper.text()).toBe('Checkbox Label')
})

test('determineModelValue should return checked value', () => {
	const checked = true
	const value = 'test'
	const modelValue = 'test'
	expect(determineModelValue(checked, value, modelValue)).toBe('test')
})

test('determineModelValue should return undefined', () => {
	const checked = false
	const value = 'test'
	const modelValue = 'test'
	expect(determineModelValue(checked, value, modelValue)).toBe(undefined)
})

test('determineModelValue should return boolean typed', () => {
	const checked = false
	const modelValue = false
	expect(determineModelValue(checked, false, modelValue)).toBe(false)
})

test('isChecked should return true', () => {
	const value = ['test']
	const modelValue = ['test']
	expect(isChecked(value, modelValue)).toBe(true)
})

test('isChecked should return false', () => {
	const value = 'test'
	const modelValue = ['test1']
	expect(isChecked(value, modelValue)).toBe(false)
})

test('checkbox should indeterminate', async () => {
	const wrapper = mount(Checkbox, {
		props: {
			indeterminate: true,
		},
	})
	expect(wrapper.html()).toContain('si-minus')
	expect(wrapper.html()).toContain('data-state="indeterminate"')
	expect(wrapper.find('.checkbox').classes()).toContain('data-[state=indeterminate]:bg-primary-default')
})

test('checkbox should be disabled', async () => {
	const wrapper = mount(Checkbox, {
		props: {
			disabled: true,
		},
	})
	expect(wrapper.html()).toContain('disabled')
})

test('checkbox should be checked if modelValue is not null', async () => {
	const wrapper = mount(Checkbox, {
		props: {
			modelValue: 'test',
			value: 'test',
		},
	})
	expect(wrapper.html()).toContain('data-state="checked"')
})

test('checkbox should be unchecked if modelValue is null', async () => {
	const wrapper = mount(Checkbox, {
		props: {
			modelValue: null,
		},
	})
	expect(wrapper.html()).not.toContain('data-state="checked"')
})

test('checkbox should be unchecked if modelValue is undefined', async () => {
	const wrapper = mount(Checkbox, {
		props: {
			modelValue: undefined,
		},
	})
	expect(wrapper.html()).not.toContain('data-state="checked"')
})

test('checkbox should be checked if value is in array', async () => {
	const wrapper = mount(Checkbox, {
		props: {
			modelValue: ['test'],
			value: 'test',
		},
	})
	expect(wrapper.html()).toContain('data-state="checked"')
})

test('checkbox should be unchecked if value is not in array', async () => {
	const wrapper = mount(Checkbox, {
		props: {
			modelValue: ['test1'],
			value: 'test',
		},
	})
	expect(wrapper.html()).not.toContain('data-state="checked"')
})

test('checkbox should be checked if modelValue is true', async () => {
	const wrapper = mount(Checkbox, {
		props: {
			modelValue: true,
			value: true,
		},
	})
	expect(wrapper.html()).toContain('data-state="checked"')
})

test('checkbox should be unchecked if modelValue is false', async () => {
	const wrapper = mount(Checkbox, {
		props: {
			modelValue: false,
			value: true,
		},
	})
	expect(wrapper.html()).not.toContain('data-state="checked"')
})

test('CheckboxGroup should be visible', () => {
	const wrapper = mount(CheckboxGroup)
	expect(wrapper.isVisible()).toBe(true)
})

test('CheckboxGroup should show error message if required validation fail', async () => {
	const wrapper = mount(FormInput, {
		props: {
			required: true,
		},
		slots: {
			default: `
        <checkbox-group :value="null" :required="true">
          <template #required>Wajib diisi</template>
        </checkbox-group>
        <button type="submit"></button>
      `,
		},
		global: {
			stubs: {
				'checkbox-group': CheckboxGroup,
			},
		},
	})
	const button = wrapper.find('button')
	await button.trigger('click')
	setTimeout(() => {
		expect(wrapper.html()).toContain('Wajib diisi')
	}, 50)
})

test('CheckboxGroup should not show error message if required validation success', async () => {
	const wrapper = mount(FormInput, {
		props: {
			required: true,
		},
		slots: {
			default: `
        <checkbox-group :value="1" :required="true">
        </checkbox-group>
        <button type="submit"></button>
      `,
		},
		global: {
			stubs: {
				'checkbox-group': CheckboxGroup,
			},
		},
	})
	const button = wrapper.find('button')
	await button.trigger('click')
	expect(wrapper.html()).not.toContain('Wajib diisi')
})

test('CheckboxGroup should show error message if custom validation fail', async () => {
	const wrapper = mount(FormInput, {
		props: {
			required: true,
		},
		slots: {
			default: `
        <checkbox-group :value="null" :custom-validators="{ test: value => value === 'test' }">
        <template #errors="{ validation }">
          <div v-if="validation.test.$invalid">
            Invalid custom error test
          </div>
        </template>
        </checkbox-group>
        <button type="submit"></button>
      `,
		},
		global: {
			stubs: {
				'checkbox-group': CheckboxGroup,
			},
		},
	})
	const button = wrapper.find('button')
	await button.trigger('click')
	setTimeout(() => {
		expect(wrapper.html()).toContain('Invalid custom error test')
	}, 50)
})
