<script setup lang="ts">
/**
 * Komponen `SSidebarFooter`, area footer sidebar dengan info user dan tombol logout.
 * @example
 * <SSidebarFooter avatar="/avatar.png" name="Nassya Putri Riani" />
 */
import { inject, ref, type Ref, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import Button from '../button/Button.vue'

const props = withDefaults(
	defineProps<{
		avatar?: string
		name?: string
		showLogout?: boolean
		class?: HTMLAttributes['class']
	}>(),
	{
		avatar: '',
		name: '',
		showLogout: true,
		class: '',
	},
)

const emit = defineEmits<{
	logout: []
}>()

const collapsed = inject<Ref<boolean>>('sidebar-collapsed', ref(false))
</script>

<template>
	<div
		:class="
			cn(
				'flex items-center gap-3 border-t border-main mt-auto',
				collapsed ? 'justify-center px-2 py-4' : 'px-4 py-4',
				props.class,
			)
		"
	>
		<slot :collapsed="collapsed">
			<!-- Avatar -->
			<div class="shrink-0">
				<img
					v-if="avatar"
					:src="avatar"
					alt="Avatar"
					class="w-10 h-10 rounded-full object-cover"
				/>
				<div
					v-else
					class="w-10 h-10 rounded-full bg-primary-10 flex items-center justify-center"
				>
					<span class="text-primary-100 font-bold text-sm">{{
						name?.charAt(0) || 'U'
					}}</span>
				</div>
			</div>

			<!-- Name -->
			<span
				v-if="!collapsed && name"
				class="flex-1 text-sm font-medium text-main truncate"
			>
				{{ name }}
			</span>

			<!-- Logout button -->
			<Button
				v-if="showLogout && !collapsed"
				variant="tertiary-danger"
				size="sm"
				aria-label="Logout"
				class="px-0"
				@click="emit('logout')"
			>
				<i
					class="si-heroicon-solid-arrow-right-end-on-rectangle text-danger-400 text-2xl"
				/>
			</Button>
		</slot>
	</div>
</template>
