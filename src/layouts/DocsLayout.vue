<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Dialog, DialogContent } from '@/components/dialog'
import Button from '@/components/button/Button.vue'
import { cn } from '@/utils/tw-merge'

const route = useRoute()
const router = useRouter()
const isMobileOpen = ref(false)

const navGroups = [
	{
		title: 'Overview',
		items: [{ label: 'Home', to: '/' }],
	},
	{
		title: 'Forms',
		items: [
			{ label: 'Input 🔥', to: '/input-example' },
			{ label: 'Textarea 🔥', to: '/textarea'},
			{ label: 'Checkbox 🔥', to: '/checkbox' },
			{ label: 'Radio 🔥', to: '/radio' },
			{ label: 'Switch 🔥', to: '/switch' },
			{ label: 'Dropdown', to: '/dropdown' },
		],
	},
	{
		title: 'Display',
		items: [
			{ label: 'Badge 🔥', to: '/badge' },
			{ label: 'Button 🔥', to: '/button' },
			{ label: 'Typography 🔥', to: '/typography' },
			{ label: 'Calendar', to: '/calendar' },
		],
	},
	{
		title: 'Feedback',
		items: [
			{ label: 'Tooltip 🔥', to: '/tooltip' },
			{ label: 'Dialog', to: '/dialog' },
			{ label: 'Accordion 🔥', to: '/accordion' },
			{ label: 'Tabs 🔥', to: '/tabs' },
		],
	},
	{
		title: 'Data',
		items: [
			{ label: 'DataTable V2', to: '/data-table-v2' },
			{ label: 'Sortable Table', to: '/sortable-table' },
			{ label: 'DataTable Perf.', to: '/datatable-performance' },
		],
	},
	{
		title: 'Navigation',
		items: [
			{ label: 'Breadcrumb 🔥', to: '/breadcrumb' },
			{ label: 'Pagination', to: '/pagination' },
		],
	},
	{
		title: 'Media',
		items: [{ label: 'Carousel', to: '/carousel' }],
	},
	{
		title: 'Editors',
		items: [{ label: 'Rich Editor 🔥', to: '/rich-editor' }],
	},
	{
		title: 'Utilities',
		items: [
			{ label: 'Custom Color', to: '/custom-color' },
			{ label: 'Form Validation', to: '/form-validation-test' },
		],
	},
]

const isActive = (to: string) => {
	if (to === '/') return route.path === '/'
	return route.path === to || route.path.startsWith(to + '/')
}

watch(
	() => route.fullPath,
	() => {
		isMobileOpen.value = false
	}
)

const handleResize = () => {
	if (window.innerWidth >= 768) {
		isMobileOpen.value = false
	}
}

onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))

const goToButton = () => {
	router.push('/button')
	isMobileOpen.value = false
}
</script>

<template>
	<div class="min-h-screen bg-white text-main">
		<header
			class="sticky top-0 z-30 flex items-center gap-2 border-b border-neutral-200 bg-white px-4 py-3 md:hidden"
		>
			<button
				type="button"
				class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-main hover:bg-neutral-50"
				aria-label="Open navigation"
				@click="isMobileOpen = true"
			>
				<i class="si-menu text-lg"></i>
			</button>
			<router-link to="/" class="text-base font-semibold">
				Sicoco v3
			</router-link>
		</header>

		<div class="flex">
			<aside
				class="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white md:block"
			>
				<div class="flex h-full flex-col">
					<div
						class="flex items-center gap-2 border-b border-neutral-200 px-5 py-4"
					>
						<router-link to="/" class="text-lg font-semibold">
							Sicoco v3
						</router-link>
					</div>
					<nav class="flex-1 overflow-y-auto px-3 py-4">
						<div
							v-for="group in navGroups"
							:key="group.title"
							class="mb-5"
						>
							<p
								class="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
							>
								{{ group.title }}
							</p>
							<ul>
								<li v-for="item in group.items" :key="item.to">
									<router-link
										:to="item.to"
										:class="
											cn(
												'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
												isActive(item.to)
													? 'bg-primary-subtle text-primary-700'
													: 'text-neutral-700 hover:bg-neutral-50 hover:text-main'
											)
										"
									>
										{{ item.label }}
									</router-link>
								</li>
							</ul>
						</div>
					</nav>
				</div>
			</aside>

			<Dialog v-model:open="isMobileOpen" :close-on-click-outside="true">
				<DialogContent
					class="left-0 top-0 flex h-screen w-72 max-w-[85vw] translate-x-0 translate-y-0 flex-col gap-0 rounded-none p-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
				>
					<div
						class="flex items-center justify-between border-b border-neutral-200 px-5 py-4"
					>
						<router-link
							to="/"
							class="text-base font-semibold"
							@click="isMobileOpen = false"
						>
							Sicoco v3
						</router-link>
						<button
							type="button"
							class="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-50"
							aria-label="Close navigation"
							@click="isMobileOpen = false"
						>
							<i class="si-x text-lg"></i>
						</button>
					</div>
					<nav class="flex-1 overflow-y-auto px-3 py-4">
						<div
							v-for="group in navGroups"
							:key="group.title"
							class="mb-5"
						>
							<p
								class="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
							>
								{{ group.title }}
							</p>
							<ul>
								<li v-for="item in group.items" :key="item.to">
									<router-link
										:to="item.to"
										:class="
											cn(
												'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
												isActive(item.to)
													? 'bg-primary-subtle text-primary-700'
													: 'text-neutral-700 hover:bg-neutral-50 hover:text-main'
											)
										"
									>
										{{ item.label }}
									</router-link>
								</li>
							</ul>
						</div>
					</nav>
				</DialogContent>
			</Dialog>

			<main class="min-w-0 flex-1">
				<slot />
			</main>
		</div>
	</div>
</template>
