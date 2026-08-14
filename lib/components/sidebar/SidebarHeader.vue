<script setup lang="ts">
import { inject, ref, type Ref, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = withDefaults(
	defineProps<{
		logo?: string
		title?: string
		subtitle?: string
		collapsed?: boolean
		showSearch?: boolean
		searchPlaceholder?: string
		class?: HTMLAttributes['class']
	}>(),
	{
		logo: '',
		title: '',
		subtitle: '',
		collapsed: false,
		showSearch: false,
		searchPlaceholder: 'Cari',
		class: '',
	},
)

const emit = defineEmits<{
	toggle: []
	search: [value: string]
}>()

const isCollapsed = inject<Ref<boolean>>('sidebar-collapsed', ref(false))

function handleSearchClick() {
	isCollapsed.value = false
}
</script>

<template>
	<div :class="cn('flex flex-col border-b border-main relative', props.class)">
		<!-- Header content -->
		<div
			class="flex items-center gap-3 mx-4 py-4"
			:class="collapsed ? 'justify-center' : ''"
		>
			<!-- Default content (props-based) -->
			<template v-if="!$slots.default">
				<div
					class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
				>
					<img
						v-if="logo"
						:src="logo"
						alt="Logo"
						class="w-12 h-12 object-contain"
					/>
					<span v-else class="text-main font-bold text-label-md">{{
						title?.charAt(0) || 'UN'
					}}</span>
				</div>
				<div v-if="!collapsed && title" class="flex flex-col min-w-0">
					<span class="font-bold text-label-md text-main truncate">{{
						title
					}}</span>
					<span
						v-if="subtitle"
						class="text-caption-md text-placeholder truncate"
						>{{ subtitle }}</span
					>
				</div>
			</template>

			<slot v-else :collapsed="collapsed" />

			<button
				class="p-1 transition-colors rounded-full bg-neutral-50 border border-main cursor-pointer absolute -right-4 w-8 h-8 flex items-center justify-center"
				@click="emit('toggle')"
			>
				<i
					:class="
						collapsed
							? 'si-heroicon-solid-chevron-right'
							: 'si-heroicon-solid-chevron-left'
					"
				/>
			</button>
		</div>

		<!-- Collapsed: search icon button -->
		<div v-if="collapsed && showSearch" class="px-4 pb-4">
			<button
				class="w-12 h-12 flex items-center justify-center rounded-lg border border-main mx-2 hover:bg-neutral-10 transition-colors"
				@click="handleSearchClick"
			>
				<i class="si-search text-neutral-600" />
			</button>
		</div>

		<!-- Expanded: search input -->
		<div v-if="!collapsed && showSearch" class="px-4 pb-4">
			<div
				class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-10 border border-main"
			>
				<i class="si-search" />
				<input
					type="text"
					:placeholder="searchPlaceholder"
					class="flex-1 bg-transparent text-sm outline-none"
					@input="emit('search', ($event.target as HTMLInputElement).value)"
				/>
			</div>
		</div>
	</div>
</template>
