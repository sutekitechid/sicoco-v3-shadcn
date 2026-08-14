<script setup lang="ts">
import { ref } from 'vue'
import { Progress } from '@/components/progress'

const progressValue = ref(65)

const variants = [
	{ label: 'Primary', variant: 'primary' as const, value: 35 },
	{ label: 'Success', variant: 'success' as const, value: 60 },
	{ label: 'Warning', variant: 'warning' as const, value: 75 },
	{ label: 'Danger', variant: 'danger' as const, value: 90 },
]
</script>

<template>
	<div class="mx-auto flex max-w-5xl flex-col gap-8 p-4 tablet:p-8">
		<header class="max-w-2xl">
			<h1 class="text-heading-sm font-semibold text-main">Progress</h1>
			<p class="mt-2 text-body-md text-neutral-600">
				Tampilkan status penyelesaian proses dengan nilai dari 0 hingga 100.
			</p>
		</header>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Default</h2>
			<div class="mt-5 max-w-xl">
				<Progress label="Upload dokumen" hint="Jangan tutup halaman selama proses berlangsung." :model-value="45" />
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Variants</h2>
			<div class="mt-5 grid gap-5 md:grid-cols-2">
				<Progress
					v-for="item in variants"
					:key="item.variant"
					:label="item.label"
					:model-value="item.value"
					:variant="item.variant"
				/>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Inline</h2>
			<div class="mt-5 flex max-w-xl flex-col gap-5">
				<Progress inline label="Memuat data" :model-value="65" />
				<Progress :model-value="65" hint="Tanpa label, layout otomatis menjadi inline." />
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Custom Content</h2>
			<div class="mt-5 max-w-xl">
				<Progress
					:model-value="70"
					label-class="text-success-600"
					value-class="font-semibold text-success-600"
					hint-class="italic"
				>
					<template #label>Sinkronisasi akun</template>
					<template #hint>Terakhir diperbarui beberapa saat lalu.</template>
				</Progress>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Disabled</h2>
			<div class="mt-5 max-w-xl">
				<Progress label="Proses dijeda" :model-value="40" disabled hint="Progress tidak dapat diperbarui saat ini." />
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Completion</h2>
			<div class="mt-5 grid gap-5 md:grid-cols-2">
				<Progress v-for="item in variants" :key="item.variant" :label="item.label" :variant="item.variant" :model-value="100" />
				<Progress label="Custom icon" variant="success" :model-value="100">
					<template #icon><i class="si-heroicon-solid-star" /></template>
				</Progress>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-md font-semibold text-main">Interactive</h2>
			<div class="mt-5 max-w-xl">
				<div class="mb-3 flex items-center justify-between text-label-md">
					<label for="progress-value" class="font-medium text-main">Progress</label>
					<span class="text-neutral-600">{{ progressValue }}%</span>
				</div>
				<input id="progress-value" v-model.number="progressValue" type="range" min="0" max="100" class="mb-5 w-full accent-primary-500" />
				<Progress inline label="Upload" :model-value="progressValue" variant="success" show-tooltip />
			</div>
		</section>
	</div>
</template>
