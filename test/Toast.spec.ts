import { test, expect } from 'vitest'

import { getToastIcon, getToastPosition } from '../lib/components/toast/index'

test('getToastIcon should return si-info', () => {
  expect(getToastIcon('default')).toBe('si-info text-primary-100')
  expect(getToastIcon('warning')).toBe('si-alert-triangle text-warning-100')
  expect(getToastIcon('danger')).toBe('si-cross-circle text-danger-100')
  expect(getToastIcon('success')).toBe('si-check-circle text-success-100')
})

test('getToastPosition', () => {
  expect(getToastPosition('top')).toBe('!top-0')
  expect(getToastPosition('bottom')).toBe('!bottom-0')
})