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
      default: '<NavItem label="Profil" />'
    },
    global: {
      stubs
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.findComponent(NavItem).exists()).toBe(true)
})

test('NavItem should have active class when isActive is true', () => {
  const wrapper = mount(NavigationMenu, {
    slots: {
      default: '<NavItem icon="si-home-alt" label="Beranda" :isActive="true" />'
    },
    global: {
      stubs
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('component').classes()).toContain('bg-primary-80')
})

test('renders multiple NavItems correctly', () => {
  const wrapper = mount(NavigationMenu, {
    slots: {
      default: `
        <NavItem label="Home" />
        <NavItem label="Profile" />
        <NavItem label="Settings" />
      `
    },
    global: {
      stubs
    }
  })
  const items = wrapper.findAllComponents(NavItem)
  expect(items).toHaveLength(3)
  expect(items[0].props('label')).toBe('Home')
  expect(items[1].props('label')).toBe('Profile')
  expect(items[2].props('label')).toBe('Settings')
})

test('applies variant and layout props correctly', () => {
  const wrapper = mount(NavigationMenu, {
    props: {
      variant: 'dark',
      layout: 'centered'
    }
  })
  expect(wrapper.find('ul').classes()).toContain('bg-slate-900')
  expect(wrapper.find('ul').classes()).toContain('justify-center')
})
