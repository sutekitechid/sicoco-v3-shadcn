<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import iconStylesUrl from '../../lib/assets/icomoon/style.css?url'

type IconFilter = 'all' | 'heroicon-solid' | 'heroicon-outline' | 'other'

const search = ref('')
const activeFilter = ref<IconFilter>('all')
const iconNames = ref<string[]>([])
const copiedIcon = ref('')

const filteredIcons = computed(() => {
	const query = search.value.trim().toLowerCase()

	return iconNames.value.filter((iconName) => {
		if (!matchesFilter(iconName)) return false
		if (!query) return true

		return getSearchableName(iconName).includes(query)
	})
})

function getIconNames(styles: string) {
	return [...styles.matchAll(/\.((?:si-)[\w-]+):before/g)]
		.map((match) => match[1])
		.sort()
}

function matchesFilter(iconName: string) {
	if (activeFilter.value === 'all') return true
	if (activeFilter.value === 'heroicon-solid') return iconName.startsWith('si-heroicon-solid-')
	if (activeFilter.value === 'heroicon-outline') return iconName.startsWith('si-heroicon-outline-')

	return !iconName.startsWith('si-heroicon-')
}

function getSearchableName(iconName: string) {
	return iconName
		.replace(/^si-heroicon-(solid|outline)-/, '')
		.replace(/^si-/, '')
}

async function copyIconName(iconName: string) {
	if (navigator.clipboard) {
		await navigator.clipboard.writeText(iconName)
	} else {
		const input = document.createElement('input')
		input.value = iconName
		document.body.appendChild(input)
		input.select()
		document.execCommand('copy')
		input.remove()
	}

	copiedIcon.value = iconName
	window.setTimeout(() => {
		if (copiedIcon.value === iconName) copiedIcon.value = ''
	}, 1500)
}

onMounted(async () => {
	const response = await fetch(iconStylesUrl)
	const styles = await response.text()
	iconNames.value = getIconNames(styles)
})
</script>

<template>
	<div class="mx-auto max-w-7xl p-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="text-2xl font-bold text-main">Icon Library</h1>
				<p class="mt-2 text-neutral-600">
					Click an icon to copy its CSS class name.
				</p>
			</div>
			<label class="w-full sm:w-80">
				<span class="sr-only">Search icons</span>
				<input
					v-model="search"
					type="search"
					placeholder="Search icons"
					class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-main outline-none placeholder:text-neutral-500 focus:border-primary-main focus:ring-2 focus:ring-primary-200"
				/>
			</label>
		</div>

		<div class="mt-6 flex flex-wrap items-center gap-2">
			<button
				v-for="filter in [
					{ value: 'all', label: 'All' },
					{ value: 'heroicon-solid', label: 'Heroicon Solid' },
					{ value: 'heroicon-outline', label: 'Heroicon Outlined' },
					{ value: 'other', label: 'Non-Heroicon' },
				] as const"
				:key="filter.value"
				type="button"
				:class="[
					'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
					activeFilter === filter.value
						? 'border-primary-main bg-primary-main text-white'
						: 'border-neutral-300 bg-white text-neutral-700 hover:border-primary-main hover:text-primary-main',
				]"
				@click="activeFilter = filter.value"
			>
				{{ filter.label }}
			</button>
			<span class="ml-1 text-sm text-neutral-600">
				{{ filteredIcons.length }} of {{ iconNames.length }} icons
			</span>
		</div>

		<div class="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
			<button
				v-for="iconName in filteredIcons"
				:key="iconName"
				type="button"
				class="group relative flex aspect-square flex-col items-center justify-center rounded-md border-2 border-neutral-200 bg-white p-2 text-center transition-colors hover:border-primary-main hover:bg-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main"
				@click="copyIconName(iconName)"
			>
				<i :class="iconName" class="text-2xl text-main" aria-hidden="true" />
				<span class="mt-2 break-words text-[10px] font-medium leading-4 text-main">
					{{ iconName }}
				</span>
				<span
					v-if="copiedIcon === iconName"
					class="absolute right-2 top-2 rounded bg-success-main px-2 py-1 text-xs font-medium text-white"
				>
					Copied
				</span>
			</button>
		</div>

		<p v-if="iconNames.length && !filteredIcons.length" class="mt-8 text-center text-neutral-600">
			No icons match "{{ search }}".
		</p>
	</div>
</template>
