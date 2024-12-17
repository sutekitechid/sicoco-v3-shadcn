import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Sidemenu from '../lib/components/sidemenu/Sidemenu.vue'

const items = [
  { label: 'Home', to: '/home' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
]

test('renders the correct number of items', () => {
  const wrapper = mount(Sidemenu, {
    props: { items }
  })

  const listItems = wrapper.findAll('li')
  expect(listItems.length).toBe(items.length)
})

test('applies the active class to the correct item based on activeIndex', async () => {
  const wrapper = mount(Sidemenu, {
    props: { items, defaultActiveIndex: 1 }
  })

  const activeItem = wrapper.findAll('li').at(1)
  expect(activeItem?.classes()).toContain('text-purple-800')

  await wrapper.findAll('li').at(2)?.find('component').trigger('click')

  await wrapper.vm.$nextTick()

  const newActiveItem = wrapper.findAll('li').at(2)
  expect(newActiveItem?.classes()).toContain('text-purple-800')

  expect(wrapper.emitted()['update:activeIndex'][0]).toEqual([2])
})

test('renders active indicator for the active item', async () => {
  const wrapper = mount(Sidemenu, {
    props: { items, defaultActiveIndex: 0 }
  })

  const activeIndicator = wrapper.find('span')
  expect(activeIndicator.exists()).toBe(true)
})

test('applies the correct variant class to the side menu', () => {
  const wrapper = mount(Sidemenu, {
    props: { items, variant: 'primary' }
  })

  const sidenavElement = wrapper.find('span')
  expect(sidenavElement.classes()).toContain('bg-primary-100')
})

test('applies custom class passed via props', () => {
  const customClass = 'custom-class'
  const wrapper = mount(Sidemenu, {
    props: { items, class: customClass }
  })

  const sidenavElement = wrapper.find('aside')
  expect(sidenavElement.classes()).toContain(customClass)
})
