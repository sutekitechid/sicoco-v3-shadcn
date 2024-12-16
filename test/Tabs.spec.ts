import { test, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Tabs from '../lib/components/tabs/Tabs.vue'
import TabsContent from '../lib/components/tabs/TabsContent.vue'
import TabsList from '../lib/components/tabs/TabsList.vue'
import TabsTrigger from '../lib/components/tabs/TabsTrigger.vue'
import Badge from '../lib/components/badge/Badge.vue'
test('Tabs should be render component with props', () => {
	const wrapper = mount(Tabs, {
		props: {
			defaultValue: 'account',
			variant: 'boxes',
		},
	})

	expect(wrapper.exists()).toBe(true)
	expect(wrapper.props().defaultValue).toBe('account')
	expect(wrapper.props().variant).toBe('boxes')
})

test('Tabs should be render component with default props', () => {
	const wrapper = mount(Tabs, {
		props: {
			defaultValue: 'account',
		},
	})

	expect(wrapper.exists()).toBe(true)
	expect(wrapper.props().defaultValue).toBe('account')
	expect(wrapper.props().variant).toBe('default')
})

test('Tab renders TabsList', () => {
	const slotContent = `
    <TabsList>
      <TabsTrigger value="account"> Account </TabsTrigger>
      <TabsTrigger value="password"> Password </TabsTrigger>
    </TabsList>
  `
	const wrapper = mount(Tabs, {
		props: {
			defaultValue: 'account',
			variant: 'default',
		},
		slots: {
			default: slotContent,
		},
		global: {
			components: { TabsList, TabsTrigger },
		},
	})

	const tabsList = wrapper.findComponent(TabsList)
	expect(tabsList.exists()).toBe(true)
})

test('Tab should be renders correct number of TabsTrigger components', () => {
	const slotContent = `
    <TabsList>
      <TabsTrigger value="account"> Account </TabsTrigger>
      <TabsTrigger value="password"> Password </TabsTrigger>
    </TabsList>
  `
	const wrapper = mount(Tabs, {
		props: {
			defaultValue: 'account',
			variant: 'boxes',
		},
		slots: {
			default: slotContent,
		},
		global: {
			components: { TabsList, TabsTrigger },
		},
	})

	const tabsTriggers = wrapper.findAllComponents(TabsTrigger)
	expect(tabsTriggers.length).toBe(2)

	const accountTrigger = tabsTriggers[0].find('[data-test="trigger-label"]')
	const passwordTrigger = tabsTriggers[1].find('[data-test="trigger-label"]')

	expect(accountTrigger.text()).toBe('Account')
	expect(passwordTrigger.text()).toBe('Password')
})

test('Tab should be renders content passed via slot', () => {
	const slotContent = `
    <TabsList>
      <TabsTrigger value="account"> Account </TabsTrigger>
    </TabsList>
    <TabsContent value="account"> Test Content </TabsContent>
  `
	const wrapper = mount(Tabs, {
		props: {
			defaultValue: 'account',
			variant: 'default',
		},
		slots: {
			default: slotContent,
		},
		global: {
			components: { TabsList, TabsTrigger, TabsContent },
		},
	})

	expect(wrapper.html()).toContain('Account')
	expect(wrapper.html()).toContain('Test Content')
})

test('Tab should be render custom class', () => {
	const customClass = 'custom-class'
	const wrapper = mount(Tabs, {
		props: {
			defaultValue: 'account',
			variant: 'boxes',
			class: customClass,
		},
	})

	const div = wrapper.find('div')
	expect(div.classes()).toContain(customClass)
})

test('Tab should be render default value ', async () => {
	const wrapper = mount(Tabs, {
		slots: {
			default: `
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password" >Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" >account content</TabsContent>
        <TabsContent value="password">password content</TabsContent>
      `,
		},
		props: {
			defaultValue: 'password',
		},
		global: {
			components: { TabsTrigger, TabsList, TabsContent },
		},
	})

	expect(wrapper.html()).not.toContain('account content')
	expect(wrapper.html()).toContain('password content')
})

test('Tab should be render default value ', async () => {
	const wrapper = mount(Tabs, {
		slots: {
			default: `
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password" >Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" >account content</TabsContent>
        <TabsContent value="password">password content</TabsContent>
      `,
		},
		props: {
			defaultValue: 'password',
		},
		global: {
			components: { TabsTrigger, TabsList, TabsContent },
		},
	})

	expect(wrapper.html()).not.toContain('account content')
	expect(wrapper.html()).toContain('password content')
	//TODO: cannot trigger click, i don't know why

	// const triggerAccount = wrapper.find('button[data-state="inactive"]')
	// await triggerAccount.trigger('click')
	// expect(wrapper.html()).toContain('account content')
})
