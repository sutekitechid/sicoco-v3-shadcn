<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type BadgeVariants, badgeVariants } from './index'
import BadgeCloseIcon from './BadgeCloseIcon.vue'

const props = withDefaults(
	defineProps<{
		type?: BadgeVariants['type']
		class?: HTMLAttributes['class']
		rounded?: boolean
		closeable?: boolean
		dataCy?: string
	}>(),
	{
		rounded: false,
		closeable: false,
	}
)

const emit = defineEmits<{
	(event: 'close', e?: Event): void
}>()

const isVisible = ref(true)

const handleClose = (event: Event) => {
	emit('close', event)
	isVisible.value = false
}
</script>

<template>
	<div
		v-if="isVisible"
		:class="
			cn(
				badgeVariants({ type: props.type, isRounded: props.rounded }),
				props.class,
				rounded
			)
		"
	>
		<div class="flex gap-2 justify-center items-center">
			<div class="my-auto">
				<slot />
			</div>
			<BadgeCloseIcon
				v-if="props.closeable"
				:type="props.type"
				@click="handleClose"
			/>
		</div>
	</div>
</template>
