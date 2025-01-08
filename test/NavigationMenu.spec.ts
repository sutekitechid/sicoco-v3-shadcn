import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import {
  NavigationMenu,
  NavigationMenuItem
} from '../lib/components/navigation-menu'

const stubs = {
  NavigationMenuItem: NavigationMenuItem
}

test('renders navigation menu correctly', () => {
  const wrapper = mount(NavigationMenu)
  expect(wrapper.find('nav').exists()).toBe(true)
})

test('renders correctly with slot', () => {
  const wrapper = mount(NavigationMenu, {
    slots: {
      default:
        '<NavigationMenuItem as="router-link" to="/" :isActive="true"><i class="si-home-alt"></i><p>Beranda</p></NavigationMenuItem>'
    },
    global: {
      stubs
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.findComponent(NavigationMenuItem).exists()).toBe(true)
})
test('renders navigation menu item correctly', () => {
  const wrapper = mount(NavigationMenuItem)
  expect(wrapper.find('li').exists()).toBe(true)
})

test('NavigationMenuItem should have active class when isActive is true', () => {
  const wrapper = mount(NavigationMenuItem, {
    props: {
      isActive: true,
      as: 'router-link',
      to: '/home'
    }
  })
  expect(wrapper?.props('isActive')).toBe(true)
  const activeItem = wrapper.find('router-link')
  expect(activeItem.classes()).toContain('bg-primary-80')
})

test('NavigationMenuItem should render as "router-link" when "to" prop is passed', () => {
  const wrapper = mount(NavigationMenuItem, {
    props: {
      to: '/home',
      as: 'router-link'
    }
  })
  const link = wrapper.find('router-link')
  expect(link.exists()).toBe(true)
  expect(link.attributes('to')).toBe('/home')
})

test('NavigationMenuItem should render as div when "to" prop is not passed and "as" is set to div', () => {
  const wrapper = mount(NavigationMenuItem, {
    props: {
      as: 'div'
    }
  })
  const div = wrapper.find('div')
  expect(div.exists()).toBe(true)
})

test('only one NavigationMenuItem should have active class at a time', async () => {
  const wrapper = mount(NavigationMenu, {
    slots: {
      default: `
        <NavigationMenuItem as="router-link" to="/home" hasDropdown><p>Home</p></NavigationMenuItem>
        <NavigationMenuItem as="router-link" to="/settings" hasDropdown><p>Settings</p></NavigationMenuItem>
      `
    },
    global: {
      stubs
    }
  })
  const items = wrapper.findAllComponents(NavigationMenuItem)

  // Klik item pertama
  await items[0].trigger('click')
  expect(items[0].find('router-link').classes()).toContain('bg-primary-80')
  expect(items[1].find('router-link').classes()).not.toContain('bg-primary-80')

  // Klik item kedua
  await items[1].trigger('click')
  expect(items[0].find('router-link').classes()).not.toContain('bg-primary-80')
  expect(items[1].find('router-link').classes()).toContain('bg-primary-80')
})

test('NavigationMenuItem should toggle active state when clicked again', async () => {
  const wrapper = mount(NavigationMenuItem, {
    props: {
      as: 'router-link',
      to: '/home',
      hasDropdown: true
    }
  })

  const item = wrapper.find('router-link')

  // Klik pertama untuk mengaktifkan
  await wrapper.trigger('click')
  expect(item.classes()).toContain('bg-primary-80')

  // Klik kedua untuk menonaktifkan
  await wrapper.trigger('click')
  expect(item.classes()).not.toContain('bg-primary-80')
})
