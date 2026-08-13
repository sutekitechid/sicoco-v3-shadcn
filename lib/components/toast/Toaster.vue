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

withDefaults(
	defineProps<{
		position?: ToastVariantPosition
	}>(),
	{
		position: 'top-center',
	}
)
</script>

<template>
	<ToastProvider>
		<Toast v-for="toast in toasts" :key="toast.id" v-bind="toast" class="mb-2">
			<div class="flex gap-3">
				<i :class="getToastIcon(toast.variant)" class="mt-1"></i>
				<div class="flex justify-between">
					<div class="grid gap-1 items-center">
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
						<ToastClose />
					</div>
					<component :is="toast.action" />
				</div>
			</div>
		</Toast>
		<ToastViewport :position="position" />
	</ToastProvider>
</template>
