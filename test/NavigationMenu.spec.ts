import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { NavigationMenu, NavItem } from '../lib/components/navigation-menu'

const stubs = {
  NavItem: NavItem
}

test('renders navigation menu correctly', () => {
  const wrapper = mount(NavigationMenu)
  expect(wrapper.find('nav').exists()).toBe(true)
})

test('renders correctly with slot', () => {
  const wrapper = mount(NavigationMenu, {
    slots: {
      default: '<NavItem to="/" :isActive="true"><i class="si-home-alt"></i><p>Beranda</p></NavItem>'
    },
    global: {
      stubs
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.findComponent(NavItem).exists()).toBe(true)
})

test('NavItem should have active class when isActive is true', () => {
  const wrapper = mount(NavItem, {
    props: {
      isActive: true
    }
  })
  expect(wrapper?.props('isActive')).toBe(true)
  const activeItem = wrapper.find('a, div')
  expect(activeItem.classes()).toContain('bg-primary-80')
})
