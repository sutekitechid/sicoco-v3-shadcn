import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Checkbox from '../lib/components/checkbox/Checkbox.vue'
import CheckboxLabel from '../lib/components/checkbox/CheckboxLabel.vue'
import { determineModelValue, isChecked } from '../lib/components/checkbox'

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
      default: 'Checkbox Label'
    }
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
      default: 'Checkbox Label'
    }
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
  const value = 'test'
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
      indeterminate: true
    }
  })
  expect(wrapper.html()).toContain('si-minus')
})
