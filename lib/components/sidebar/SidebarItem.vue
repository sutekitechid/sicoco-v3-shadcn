<script setup lang="ts">
import { computed, inject, ref, type Ref, type HTMLAttributes } from 'vue'
import { useRoute } from 'vue-router'
import { cn } from '../../utils/tw-merge'
import { sidebarItemVariants } from '.'

const props = withDefaults(
	defineProps<{
		icon?: string
		label?: string
		to?: string
		defaultOpen?: boolean
		class?: HTMLAttributes['class']
	}>(),
	{
		icon: '',
		label: '',
		to: '',
		defaultOpen: false,
		class: '',
	},
)

const route = useRoute()
const collapsed = inject<Ref<boolean>>('sidebar-collapsed', ref(false))
const isOpen = ref(props.defaultOpen)
const hasChildren = computed(() => !!slots.default)

const slots = defineSlots<{
	default: () => unknown
}>()

const isActive = computed(() => {
	if (props.to) return route.path === props.to
	return false
})

function toggle() {
	isOpen.value = !isOpen.value
}

defineExpose({ isOpen })
</script>

<template>
	<div>
		<!-- Item without children -->
		<router-link
			v-if="!hasChildren && to"
			:to="to"
			:title="collapsed ? label : undefined"
			:class="
				cn(
					sidebarItemVariants({
						variant: isActive ? 'active' : 'default',
						size: collapsed ? 'collapsed' : 'default',
					}),
					props.class,
				)
			"
		>
			<i v-if="icon" :class="icon" class="text-body-md" />
			<span v-if="!collapsed" class="truncate">{{ label }}</span>
		</router-link>

		<!-- Item with children (dropdown) -->
		<template v-else>
			<button
				:title="collapsed ? label : undefined"
				:class="
					cn(
						sidebarItemVariants({
							variant: 'default',
							size: collapsed ? 'collapsed' : 'default',
						}),
						'w-full',
						props.class,
					)
				"
				@click="toggle"
			>
				<i v-if="icon" :class="icon" class="text-body-md" />
				<span v-if="!collapsed" class="flex-1 text-left truncate">{{
					label
				}}</span>
				<i
					v-if="!collapsed"
					:class="
						cn(
							'si-chevron-down transition-transform text-title-sm text-secondary',
							isOpen ? 'rotate-180' : '',
						)
					"
				/>
			</button>

			<!-- Dropdown children -->
			<div
				v-if="isOpen && !collapsed"
				class="ml-6 mt-1 space-y-1 border-l border-main pl-3"
			>
				<slot />
			</div>
		</template>
	</div>
</template>
