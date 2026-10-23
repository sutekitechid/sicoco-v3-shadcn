<script setup lang="ts">
import { isVNode } from 'vue'
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	getToastIcon,
	type ToastVariantPosition,
} from '.'
import { useToast } from './use-toast'

const { toasts } = useToast()

const props = withDefaults(
	defineProps<{
		position?: ToastVariantPosition
	}>(),
	{
		position: 'top-right',
	},
)
</script>

<template>
	<ToastProvider>
		<Toast
			v-for="toast in toasts"
			:key="toast.id"
			v-bind="toast"
			class="mb-2"
		>
			<div class="flex min-w-0 flex-1 gap-3">
				<i :class="[getToastIcon(toast.variant), 'mb-auto']"></i>
				<div class="min-w-0 flex-1">
					<div class="grid items-center gap-1">
						<ToastTitle v-if="toast.title">
							{{ toast.title }}
						</ToastTitle>
						<template v-if="toast.description">
							<ToastDescription v-if="isVNode(toast.description)">
								<component :is="toast.description" />
							</ToastDescription>
							<ToastDescription v-else>
								{{ toast.description }}
							</ToastDescription>
						</template>
					</div>
				</div>
			</div>
			<component :is="toast.action" />
			<ToastClose />
		</Toast>
		<ToastViewport :position="props.position" />
	</ToastProvider>
</template>
