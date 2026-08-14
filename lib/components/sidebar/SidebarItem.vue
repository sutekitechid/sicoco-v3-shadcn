<script setup lang="ts">
import { computed, inject, ref, type Ref, type HTMLAttributes } from 'vue'
import { useRoute } from 'vue-router'
import { cn } from '../../utils/tw-merge'
import { sidebarItemVariants } from '.'
import { Tooltip, TooltipContent } from '@/components/tooltip'

const props = withDefaults(
	defineProps<{
		icon?: string
		label?: string
		to?: string
		defaultOpen?: boolean
		isOpen?: boolean | null
		hasActiveChild?: boolean
		class?: HTMLAttributes['class']
	}>(),
	{
		icon: '',
		label: '',
		to: '',
		defaultOpen: false,
		isOpen: null,
		hasActiveChild: false,
		class: '',
	},
)

const route = useRoute()
const collapsed = inject<Ref<boolean>>('sidebar-collapsed', ref(false))
const setCollapsed = inject<(val: boolean) => void>('sidebar-set-collapsed', () => {})
const internalOpen = ref(props.defaultOpen)
const hasChildren = computed(() => !!slots.default)

const slots = defineSlots<{
	default: () => unknown
}>()

const isActive = computed(() => {
	if (props.to) return route.path === props.to
	return false
})

const isItemActive = computed(() => isActive.value || props.hasActiveChild)

const isDropdownOpen = computed(() => {
	if (props.isOpen !== null) return props.isOpen
	return internalOpen.value
})

function toggle() {
	internalOpen.value = !internalOpen.value
}

function handleCollapsedClick() {
	setCollapsed(false)
}

defineExpose({ isOpen: isDropdownOpen })
</script>

<template>
	<div>
		<!-- Expanded: no tooltip -->
		<template v-if="!collapsed">
			<!-- Item without children -->
			<router-link
				v-if="!hasChildren && to"
				:to="to"
				:class="
					cn(
						sidebarItemVariants({
							variant: isItemActive ? 'active' : 'default',
							size: 'default',
						}),
						props.class,
					)
				"
			>
				<i v-if="icon" :class="icon" class="text-body-md" />
				<span class="truncate">{{ label }}</span>
			</router-link>

			<!-- Item with children (dropdown) -->
			<template v-else>
				<button
					:class="
						cn(
							sidebarItemVariants({
								variant: isItemActive ? 'active' : 'default',
								size: 'default',
							}),
							props.class,
						)
					"
					@click="toggle"
				>
					<i v-if="icon" :class="icon" class="text-body-md" />
					<span class="flex-1 text-left truncate">{{ label }}</span>
					<i
						:class="
							cn(
								'si-chevron-down transition-transform text-title-sm ',
								isDropdownOpen ? 'rotate-180' : '',
								isItemActive ? 'text-neutral-50' : 'text-secondary',
							)
						"
					/>
				</button>

				<!-- Dropdown children -->
				<div
					v-if="isDropdownOpen"
					class="ml-6 mt-1 space-y-1 border-l border-main pl-3"
				>
					<slot />
				</div>
			</template>
		</template>

		<!-- Collapsed: with tooltip -->
		<Tooltip v-else trigger="hover" :duration="10">
			<template #trigger>
				<!-- Item without children -->
				<div
					v-if="!hasChildren && to"
					:class="
						cn(
							sidebarItemVariants({
								variant: isItemActive ? 'active' : 'default',
								size: 'collapsed',
							}),
							props.class,
						)
					"
					@click="handleCollapsedClick"
				>
					<i v-if="icon" :class="icon" class="text-body-md" />
				</div>

				<!-- Item with children -->
				<button
					v-else
					:class="
						cn(
							sidebarItemVariants({
								variant: isItemActive ? 'active' : 'default',
								size: 'collapsed',
							}),
							props.class,
						)
					"
					@click="handleCollapsedClick"
				>
					<i v-if="icon" :class="icon" class="text-body-md" />
				</button>
			</template>
			<TooltipContent position="right" :side-offset="8" variant="white">
				{{ label }}
			</TooltipContent>
		</Tooltip>
	</div>
</template>
