import { test, expect } from 'vitest'

import { getToastIcon, getToastPosition, toastIconVariantEnum } from '../lib/components/toast/index'

test('getToastIcon should return si-info', () => {
  expect(getToastIcon('default')).toBe(toastIconVariantEnum.primary)
  expect(getToastIcon('warning')).toBe(toastIconVariantEnum.warning)
  expect(getToastIcon('danger')).toBe(toastIconVariantEnum.danger)
  expect(getToastIcon('success')).toBe(toastIconVariantEnum.success)
})

test('getToastPosition', () => {
  expect(getToastPosition('top')).toBe('!top-0')
  expect(getToastPosition('bottom')).toBe('!bottom-0')
})