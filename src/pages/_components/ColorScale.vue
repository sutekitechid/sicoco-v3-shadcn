<template>
	<div>
		<div class="grid grid-cols-11 gap-1">
			<div
				v-for="(shade, i) in shades"
				:key="stops[i]"
				class="aspect-square rounded-sm flex flex-col items-center justify-end p-2 text-[10px] font-mono"
				:style="{
					backgroundColor: `rgb(${shade[0]}, ${shade[1]}, ${shade[2]})`,
					color: getContrastColor(shade),
				}"
			>
				<span class="font-semibold">{{ stops[i] }}</span>
			</div>
		</div>
		<div class="mt-2 text-[10px] font-mono text-neutral-500 text-center">
			{{ inputColor }} →
			<span v-for="(shade, i) in shades" :key="stops[i]" class="mx-1">
				<span v-if="i === 5" class="font-semibold text-neutral-700">
					{{ shade.join(' ') }}
				</span>
			</span>
			<br />
			<span class="text-neutral-400">shade 500 (anchor)</span>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	shades: [number, number, number][]
	inputColor: string
	stops?: readonly number[]
	isReference?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	stops: () => [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
	isReference: false,
})

function getContrastColor(rgb: [number, number, number]): string {
	const [r, g, b] = rgb
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
	return luminance > 0.5 ? '#000' : '#fff'
}
</script>
