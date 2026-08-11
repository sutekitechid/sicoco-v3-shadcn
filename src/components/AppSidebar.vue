<script setup lang="ts">
import { ref, computed } from 'vue'
import {
	Sidebar,
	SidebarHeader,
	SidebarItem,
	SidebarFooter,
} from '@/components/sidebar'

const isCollapsed = ref(false)
const searchQuery = ref('')

const menuItems = [
	{
		label: 'Beranda',
		to: '/',
		icon: 'si-home',
	},
	{
		label: 'Persiapan',
		icon: 'si-folder',
		children: [
			{ label: 'Sub Menu 1', to: '/persiapan/1' },
			{ label: 'Sub Menu 2', to: '/persiapan/2' },
		],
	},
	{
		label: 'Penetapan',
		icon: 'si-file-text',
		children: [
			{ label: 'Sub Menu 1', to: '/penetapan/1' },
			{ label: 'Sub Menu 2', to: '/penetapan/2' },
		],
	},
	{
		label: 'Pelaksanaan',
		to: '/pelaksanaan',
		icon: 'si-clipboard-edit',
	},
	{
		label: 'Evaluasi',
		to: '/evaluasi',
		icon: 'si-list',
	},
	{
		label: 'Pengendalian',
		icon: 'si-shield',
		children: [
			{ label: 'Sub Menu 1', to: '/pengendalian/1' },
			{ label: 'Sub Menu 2', to: '/pengendalian/2' },
		],
	},
	{
		label: 'Peningkatan',
		to: '/peningkatan',
		icon: 'si-trending-up',
	},
	{
		label: 'Repositori SPMI',
		to: '/repositori-spmi',
		icon: 'si-database',
	},
	{
		label: 'Pengaturan',
		icon: 'si-settings',
		children: [
			{ label: 'Profil', to: '/pengaturan/profil' },
			{ label: 'Akun', to: '/pengaturan/akun' },
		],
	},
]

const filteredItems = computed(() => {
	if (!searchQuery.value) return menuItems

	const q = searchQuery.value.toLowerCase()

	return menuItems
		.map(item => {
			// Check if parent label matches
			const parentMatch = item.label.toLowerCase().includes(q)

			// Check if any child matches
			const filteredChildren = item.children?.filter(child =>
				child.label.toLowerCase().includes(q),
			)

			// Include item if parent matches or has matching children
			if (parentMatch || (filteredChildren && filteredChildren.length > 0)) {
				return {
					...item,
					children: filteredChildren,
				}
			}

			return null
		})
		.filter(Boolean) as typeof menuItems
})

function handleSearch(value: string) {
	searchQuery.value = value
}

function handleLogout() {
	console.log('Logout clicked')
}
</script>

<template>
	<Sidebar v-model:collapsed="isCollapsed">
		<SidebarHeader
			title="Universitas Suteki"
			subtitle="Sentral Data"
			:collapsed="isCollapsed"
			:show-search="true"
			search-placeholder="Cari"
			logo="https://halamanku.vercel.app/logo.svg"
			@toggle="isCollapsed = !isCollapsed"
			@search="handleSearch"
		/>

		<div
			class="flex flex-col gap-1 p-2 flex-1 overflow-y-auto"
			:class="isCollapsed ? 'items-center' : ''"
		>
			<template v-for="(item, index) in filteredItems" :key="index">
				<!-- Single menu item -->
				<SidebarItem
					v-if="!item.children"
					:icon="item.icon"
					:label="item.label"
					:to="item.to"
				/>

				<!-- Menu item with dropdown -->
				<SidebarItem
					v-else
					:icon="item.icon"
					:label="item.label"
					:default-open="!!searchQuery"
				>
					<SidebarItem
						v-for="(child, childIndex) in item.children"
						:key="childIndex"
						:label="child.label"
						:to="child.to"
					/>
				</SidebarItem>
			</template>
		</div>

		<SidebarFooter
			name="Macan"
			avatar="https://halamanku.vercel.app/logo.svg"
			:collapsed="isCollapsed"
			@logout="handleLogout"
		/>
	</Sidebar>
</template>
