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

  const listItems = wrapper.findAll('section')
  expect(listItems.length).toBe(items.length)
})

test('applies the active class to the correct item based on activeIndex', async () => {
  const wrapper = mount(Sidemenu, {
    props: { items, defaultActiveIndex: 1 }
  })

  const activeItem = wrapper.findAllComponents({ name: 'SidemenuItem' }).at(1)
  expect(activeItem?.props('isActive')).toBe(true)

  await wrapper
    .findAllComponents({ name: 'SidemenuItem' })
    .at(2)
    ?.trigger('click')

  await wrapper.vm.$nextTick()

  const newActiveItem = wrapper
    .findAllComponents({ name: 'SidemenuItem' })
    .at(2)
  expect(newActiveItem?.props('isActive')).toBe(true)

  expect(wrapper.emitted()['update:activeIndex'][0]).toEqual([2])
})

test('renders active indicator for the active item', async () => {
  const wrapper = mount(Sidemenu, {
    props: { items, defaultActiveIndex: 0 }
  })

  const activeIndicator = wrapper.find('span')
  expect(activeIndicator.exists()).toBe(true)
})

test('applies custom class passed via props at parent element', () => {
  const customClass = 'custom-class'
  const wrapper = mount(Sidemenu, {
    props: { items, class: customClass }
  })

  const sidenavElement = wrapper.find('aside')
  expect(sidenavElement.classes()).toContain(customClass)
})

test('applies custom active class passed via props to child element', () => {
  const classValue = 'ml-3'
  const wrapper = mount(Sidemenu, {
    props: {
      items: [
        { label: 'Dashboard', to: '/' },
        { label: 'Finance', to: '/finance' }
      ],
      defaultActiveIndex: 0,
      itemClass: classValue
    }
  })

  const activeItem = wrapper.findComponent({ name: 'SidemenuItem' })
  expect(activeItem.props('itemClass')).toBe(classValue)
})
