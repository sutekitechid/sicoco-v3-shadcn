<script setup lang="ts">
import {
	DrawerRoot,
	type DrawerRootEmits,
	type DrawerRootProps,
	useForwardPropsEmits,
} from 'reka-ui'
import { computed, provide } from 'vue'

interface Props extends DrawerRootProps {
	closeOnClickOutside?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	modal: true,
	swipeDirection: 'down',
	closeOnClickOutside: true,
})
const emits = defineEmits<DrawerRootEmits>()

const forwarded = useForwardPropsEmits(
	computed(() => {
		const delegated: Partial<Props> = { ...props }
		delete delegated.closeOnClickOutside
		return delegated
	}),
	emits
)

provide('drawerCloseOnClickOutside', props.closeOnClickOutside)
</script>

<template>
	<DrawerRoot v-bind="forwarded">
		<slot />
	</DrawerRoot>
</template>
