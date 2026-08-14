<script setup lang="ts">
import { buttonContentVariants, type ButtonContentVariants } from '.'

interface Props {
	size?: ButtonContentVariants['size']
	iconLeft?: string
	iconRight?: string
	textBorder?: boolean
}

defineProps<Props>()
</script>

<template>
	<div :class="buttonContentVariants({ size })">
		<template v-if="$slots['icon-left'] || iconLeft">
			<template v-if="iconLeft">
				<i :class="iconLeft" />
			</template>
			<template v-else>
				<slot name="icon-left" />
			</template>
		</template>

		<span v-if="textBorder" class="border-b border-current"><slot /></span>
		<slot v-else />

		<template v-if="$slots['icon-right'] || iconRight">
			<template v-if="iconRight">
				<i :class="iconRight" />
			</template>
			<template v-else>
				<slot name="icon-right" />
			</template>
		</template>
	</div>
</template>
