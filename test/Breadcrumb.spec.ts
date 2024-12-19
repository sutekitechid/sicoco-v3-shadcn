import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../lib/components/breadcrumb'

const stubs = {
  'breadcrumb-item': BreadcrumbItem,
}

test('Breadcrumb should render correctly', () => {
  const wrapper = mount(Breadcrumb, {
    slots: {
      default: `
              <breadcrumb-item>
              Home
              </breadcrumb-item>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>`
    },
    global: {
      stubs
    }
  })
  expect(wrapper.html()).toContain('Shadcn Breadcrumb')
})

test('Breadcrumb should have correct links', () => {
  const wrapper = mount(Breadcrumb, {
    slots: {
      default: `
              <breadcrumb-item to="/">
              Home
              </breadcrumb-item>
              <breadcrumb-item to="/shadcn-breadcrumb">
              Shadcn Breadcrumb
              </breadcrumb-item>`
    },
    global: {
      stubs
    }
  })

  console.log(wrapper.html())

  const links = wrapper.findAll('a')
  expect(links[0].attributes('href')).toBe('/')
  expect(links[1].attributes('href')).toBe('/shadcn-breadcrumb')
})

test('Breadcrumb should have correct separators', () => {
  const wrapper = mount(Breadcrumb, {
    slots: {
      default: `
          <breadcrumb-list>
              <breadcrumb-item>
              Home
              </breadcrumb-item>
              <breadcrumb-separator>
              /
              </breadcrumb-separator>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>
          </breadcrumb-list>`
    },
    global: {
      stubs
    }
  })

	expect(wrapper.html()).toContain('si-chevron-right')
})

test('Breadcrumb should have correct ellipsis', () => {
  const wrapper = mount(Breadcrumb, {
    slots: {
      default: `
              <breadcrumb-item>
              Home
              </breadcrumb-item>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>`
    },
    global: {
      stubs
    }
  })

  expect(wrapper.html()).toContain('si-more-horizontal')
})

test('Breadcrumb should not has ellipsis', () => {
  const wrapper = mount(Breadcrumb, {
    slots: {
      default: `
              <breadcrumb-item>
              Home
              </breadcrumb-item>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>
              <breadcrumb-item>
              Shadcn Breadcrumb
              </breadcrumb-item>`
    },
    global: {
      stubs
    }
  })

  expect(wrapper.html()).not.toContain('si-more-horizontal')
})
