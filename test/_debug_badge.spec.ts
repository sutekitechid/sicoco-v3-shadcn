import { mount } from '@vue/test-utils'
import { test } from 'vitest'
import Badge from '../lib/components/badge/Badge.vue'

test('debug', () => {
  const w = mount(Badge, { props: { variant: 'primary', size: 'small' }, slots: { default: 'x' } })
  console.error('CLASSES:', w.find('div').classes().join(' '))
})
