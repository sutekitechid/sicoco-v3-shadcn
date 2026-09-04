<template>
	<div class="flex max-w-4xl flex-col gap-8 p-4 sm:p-6">
		<div>
			<h2 class="text-2xl font-semibold text-main">Slider</h2>
			<p class="text-main">
				Slider component untuk memilih nilai dari rentang tertentu dengan drag thumb.
			</p>
		</div>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Basic Usage</h3>
			<p class="mb-4 text-sm text-main">
				Slider dengan nilai default 0-100.
			</p>
			<div class="flex flex-col gap-4">
				<Slider v-model="basicValue" />
				<p class="text-sm text-neutral-60">Nilai: {{ basicValue }}</p>
			</div>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Custom Range</h3>
			<p class="mb-4 text-sm text-main">
				Slider dengan min, max, dan step custom.
			</p>
			<div class="flex flex-col gap-4">
				<Slider v-model="rangeValue" :min="0" :max="50" :step="5" />
				<p class="text-sm text-neutral-60">Nilai: {{ rangeValue }}</p>
			</div>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Disabled</h3>
			<p class="mb-4 text-sm text-main">
				Slider dalam keadaan disabled.
			</p>
			<div class="flex flex-col gap-4">
				<Slider :model-value="30" disabled />
			</div>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Vertical Orientation</h3>
			<p class="mb-4 text-sm text-main">
				Slider dengan orientasi vertikal.
			</p>
			<div class="flex h-48 justify-center">
				<Slider v-model="verticalValue" orientation="vertical" />
			</div>
			<p class="mt-2 text-center text-sm text-neutral-60">Nilai: {{ verticalValue }}</p>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Events</h3>
			<div class="mt-2 flex flex-col gap-2">
				<p v-if="lastEvent" class="text-sm text-success-default">
					{{ lastEvent }}
				</p>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Slider } from '@/components/slider'

const basicValue = ref(50)
const rangeValue = ref(20)
const verticalValue = ref(50)
const lastEvent = ref('')

watch(basicValue, (val) => {
	lastEvent.value = `Basic slider changed: ${val}`
})

watch(rangeValue, (val) => {
	lastEvent.value = `Range slider changed: ${val}`
})

watch(verticalValue, (val) => {
	lastEvent.value = `Vertical slider changed: ${val}`
})
</script>
