<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/button/Button.vue'
import Badge from '@/components/badge/Badge.vue'

const router = useRouter()

const goToDocs = () => {
	router.push('/button')
}

const componentLinks = [
	{ label: 'Accordion', path: '/accordion' },
	{ label: 'Alert', path: '/alert' },
	{ label: 'Badge', path: '/badge' },
	{ label: 'Breadcrumb', path: '/breadcrumb' },
	{ label: 'Button', path: '/button' },
	{ label: 'Calendar', path: '/calendar' },
	{ label: 'Datepicker', path: '/datepicker' },
	{ label: 'Carousel', path: '/carousel' },
	{ label: 'Checkbox', path: '/checkbox' },
	{ label: 'Custom Color', path: '/custom-color' },
	{ label: 'DataTable V2', path: '/data-table-v2' },
	{ label: 'Dialog', path: '/dialog' },
	{ label: 'Dropdown', path: '/dropdown' },
	{ label: 'Input', path: '/input-example' },
	{ label: 'Icon Library', path: '/icons' },
	{ label: 'Loading', path: '/loading' },
	{ label: 'Pin Input', path: '/pin-input' },
	{ label: 'Pagination', path: '/pagination' },
	{ label: 'Progress', path: '/progress' },
	{ label: 'Radio', path: '/radio' },
	{ label: 'Rich Editor', path: '/rich-editor' },
	{ label: 'Switch', path: '/switch' },
	{ label: 'Tabs', path: '/tabs' },
	{ label: 'Textarea', path: '/textarea' },
	{ label: 'Tooltip', path: '/tooltip' },
	{ label: 'Toast', path: '/toast' },
	{ label: 'Typography', path: '/typography' },
	{ label: 'Form Validation', path: '/form-validation-test' },
]

const features = [
	{
		icon: 'si-layers',
		title: 'Composable',
		description:
			'Build complex interfaces from focused, single-responsibility components that compose naturally with Vue 3.',
	},
	{
		icon: 'si-eye',
		title: 'Accessible',
		description:
			'Every component follows the WAI-ARIA design pattern, navigable by keyboard and assistive technologies out of the box.',
	},
	{
		icon: 'si-paint',
		title: 'Themable',
		description:
			'Customize the look and feel through a Tailwind-first token system that scales from a single brand to multiple themes.',
	},
]
</script>

<template>
	<div class="min-h-screen bg-white text-main">
		<!-- Hero -->
		<section
			class="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-b from-primary-subtle to-white"
		>
			<div class="mx-auto max-w-6xl px-6 py-20 sm:py-28">
				<Badge variant="primary" class="mb-6">v3 · Vue 3 · Tailwind CSS</Badge>
				<h1
					class="text-4xl font-bold leading-tight tracking-tight text-main sm:text-5xl md:text-6xl"
				>
					Sicoco v3
				</h1>
				<p
					class="mt-4 text-xl font-medium text-neutral-700 sm:text-2xl"
				>
					A composable design system for building consistent, accessible
					interfaces.
				</p>
				<p class="mt-6 max-w-2xl text-base text-neutral-600 sm:text-lg">
					Sicoco is a production-grade Vue 3 component library that pairs the
					flexibility of Tailwind CSS with the rigor of a fully-typed API.
					Ship pixel-perfect UIs faster with primitives that scale from a
					prototype to an enterprise platform.
				</p>
				<div class="mt-8 flex flex-wrap items-center gap-3">
					<Button size="lg" @click="goToDocs">
						Read the docs
						<i class="si-arrow-right ml-1"></i>
					</Button>
					<Button size="lg" outlined @click="router.push('/accordion')">
						See components
					</Button>
				</div>
			</div>
		</section>

		<!-- Why Sicoco -->
		<section class="border-b border-neutral-200">
			<div class="mx-auto max-w-6xl px-6 py-16 sm:py-20">
				<div class="mb-10 max-w-2xl">
					<h2 class="text-2xl font-semibold sm:text-3xl">Why Sicoco?</h2>
					<p class="mt-2 text-neutral-600">
						A pragmatic foundation for the interfaces you actually need to
						build.
					</p>
				</div>
				<div class="grid gap-6 md:grid-cols-3">
					<div
						v-for="feature in features"
						:key="feature.title"
						class="rounded-lg border border-neutral-200 bg-white p-6 transition-colors hover:border-primary-300"
					>
						<div
							class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-subtle text-primary-default"
						>
							<i :class="feature.icon" class="text-xl"></i>
						</div>
						<h3 class="text-lg font-semibold">{{ feature.title }}</h3>
						<p class="mt-2 text-sm text-neutral-600">
							{{ feature.description }}
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Browse Components -->
		<section>
			<div class="mx-auto max-w-6xl px-6 py-16 sm:py-20">
				<div class="mb-10 max-w-2xl">
					<h2 class="text-2xl font-semibold sm:text-3xl">
						Browse components
					</h2>
					<p class="mt-2 text-neutral-600">
						Jump straight into a specific component's API, variants, and
						usage examples.
					</p>
				</div>
				<div
					class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
				>
					<router-link
						v-for="link in componentLinks"
						:key="link.path"
						:to="link.path"
						class="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-main transition-colors hover:border-primary-default hover:text-primary-default"
					>
						{{ link.label }}
					</router-link>
				</div>
			</div>
		</section>

		<footer class="border-t border-neutral-200">
			<div
				class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-6 text-sm text-neutral-500 sm:flex-row sm:items-center"
			>
				<p>Sicoco v3 Design System</p>
				<p>Built with Vue 3, Reka UI, and Tailwind CSS.</p>
			</div>
		</footer>
	</div>
</template>
