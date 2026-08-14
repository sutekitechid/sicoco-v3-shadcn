<script setup lang="ts">
import { inject, ref, type Ref, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = withDefaults(
	defineProps<{
		label?: string
		class?: HTMLAttributes['class']
	}>(),
	{
		label: '',
		class: '',
	},
)

const collapsed = inject<Ref<boolean>>('sidebar-collapsed', ref(false))
</script>

<template>
	<div :class="cn('mt-4', props.class)">
		<!-- Label (hidden when collapsed) -->
		<p
			v-if="label && !collapsed"
			class=" mb-2 text-xs font-semibold uppercase tracking-wide text-placeholder"
		>
			{{ label }}
		</p>
		<!-- Divider when collapsed -->
		<div v-if="collapsed" class="mb-1 text-center flex items-center justify-center" >
				<span class="si-heroicon-solid-ellipsis-horizontal"></span>
		</div>
		<!-- Items -->
		<div :class="`flex flex-col gap-1 ${collapsed ? 'items-center': ''}`">
			<slot />
		</div>
	</div>
</template>

