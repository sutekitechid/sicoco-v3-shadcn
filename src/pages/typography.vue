<script setup lang="ts">
const typographyScale = [
	{
		category: 'Display',
		description: 'Gunakan untuk hero sections, marketing pages, dan large headers.',
		items: [
			{ name: 'display-xl', label: 'Display XL', class: 'text-display-xl font-bold', sample: 'Hero Title', values: 'M 4/4.75, T 5/5.75, D 6/6.75rem' },
			{ name: 'display-lg', label: 'Display LG', class: 'text-display-lg font-bold', sample: 'Hero Title', values: 'M 3.25/4, T 4/4.75, D 5/5.75rem' },
			{ name: 'display-md', label: 'Display MD', class: 'text-display-md font-bold', sample: 'Hero Title', values: 'M 2.5/3.25, T 3.25/4, D 4/4.75rem' },
			{ name: 'display-sm', label: 'Display SM', class: 'text-display-sm font-bold', sample: 'Hero Title', values: 'M 2.25/3, T 2.5/3.25, D 3.25/4rem' },
		],
	},
	{
		category: 'Heading',
		description: 'Gunakan untuk section headers, page titles, dan major UI divisions.',
		items: [
			{ name: 'heading-xl', label: 'Heading XL', class: 'text-heading-xl font-bold', sample: 'Section Title', values: 'M 2/2.75, T 2.25/3, D 2.5/3.25rem' },
			{ name: 'heading-lg', label: 'Heading LG', class: 'text-heading-lg font-bold', sample: 'Section Title', values: 'M 1.75/2.5, T 2/2.75, D 2.25/3rem' },
			{ name: 'heading-md', label: 'Heading MD', class: 'text-heading-md font-bold', sample: 'Section Title', values: 'M 1.5/2.25, T 1.75/2.5, D 2/2.75rem' },
			{ name: 'heading-sm', label: 'Heading SM', class: 'text-heading-sm font-semibold', sample: 'Section Title', values: 'M 1.375/2, T 1.5/2.25, D 1.75/2.5rem' },
		],
	},
	{
		category: 'Title',
		description: 'Gunakan untuk card titles, list headers, dan sub-section headers.',
		items: [
			{ name: 'title-lg', label: 'Title LG', class: 'text-title-lg font-semibold', sample: 'Card Title', values: 'M 1.25/1.875, T 1.375/2, D 1.5/2.25rem' },
			{ name: 'title-md', label: 'Title MD', class: 'text-title-md font-semibold', sample: 'Card Title', values: 'M 1.125/1.75, T 1.25/1.875, D 1.375/2rem' },
			{ name: 'title-sm', label: 'Title SM', class: 'text-title-sm font-semibold', sample: 'Card Title', values: 'M 1/1.5, T 1.125/1.75, D 1.25/1.875rem' },
		],
	},
	{
		category: 'Body',
		description: 'Gunakan untuk paragraf, list items, dan konten utama.',
		items: [
			{ name: 'body-lg', label: 'Body LG', class: 'text-body-lg', sample: 'Body text untuk paragraf utama.', values: 'M 1/1.5, T 1/1.5, D 1.125/1.75rem' },
			{ name: 'body-md', label: 'Body MD', class: 'text-body-md', sample: 'Default body text untuk paragraf standar.', values: 'M 0.875/1.25, T 0.875/1.5, D 1/1.5rem' },
			{ name: 'body-sm', label: 'Body SM', class: 'text-body-sm', sample: 'Small body text untuk deskripsi atau catatan.', values: 'M 0.75/1.25, T 0.75/1.25, D 0.875/1.25rem' },
		],
	},
	{
		category: 'Label',
		description: 'Gunakan untuk form labels, button text, dan UI controls.',
		items: [
			{ name: 'label-lg', label: 'Label LG', class: 'text-label-lg font-medium', sample: 'Form Label', values: 'M 0.875/1.5, T 0.875/1.5, D 1/1.5rem' },
			{ name: 'label-md', label: 'Label MD', class: 'text-label-md font-medium', sample: 'Form Label', values: 'M 0.75/1.25, T 0.875/1.25, D 0.875/1.25rem' },
			{ name: 'label-sm', label: 'Label SM', class: 'text-label-sm font-medium', sample: 'Form Label', values: 'M 0.75/1.25, T 0.75/1.25, D 0.75/1.25rem' },
		],
	},
	{
		category: 'Caption',
		description: 'Gunakan untuk timestamps, helper text, dan metadata.',
		items: [
			{ name: 'caption-md', label: 'Caption MD', class: 'text-caption-md', sample: 'Caption atau helper text', values: 'M 0.75/1, T 0.75/1.25, D 0.75/1.375rem' },
			{ name: 'caption-sm', label: 'Caption SM', class: 'text-caption-sm', sample: 'Smallest caption', values: 'M 0.6875/0.875, T 0.6875/1, D 0.6875/1.125rem' },
		],
	},
]
</script>

<template>
	<div class="min-h-screen p-8 space-y-12">
		<header class="space-y-2">
			<h1 class="text-display-sm font-bold">Typography Scale</h1>
			<p class="text-body-md">
				Sistem typography terstruktur: Display → Heading → Title → Body → Label → Caption.
				Setiap kelas mengatur <code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">font-size</code>,
				<code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">line-height</code>, dan
				<code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">letter-spacing</code>.
				Mobile adalah default, Tablet aktif mulai <code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">48rem</code>, dan Desktop mulai <code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">64rem</code>.
				Font weight di-set terpisah via utility <code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">font-bold</code> dll.
			</p>
		</header>

		<section
			v-for="group in typographyScale"
			:key="group.category"
			class="space-y-6"
		>
			<div class="space-y-1 border-b pb-4">
				<h2 class="text-heading-md font-bold">{{ group.category }}</h2>
				<p class="text-body-sm">{{ group.description }}</p>
			</div>

			<div class="grid gap-4">
				<div
					v-for="item in group.items"
					:key="item.name"
					class="grid grid-cols-12 gap-4 items-baseline border-b border-neutral-100 pb-4"
				>
					<div class="col-span-3">
						<div class="text-label-md font-semibold">{{ item.label }}</div>
						<code class="text-caption-sm text-neutral-700">text-{{ item.name }}</code>
						<div class="text-caption-sm text-neutral-500 mt-1">{{ item.values }}</div>
					</div>
					<div class="col-span-9 overflow-hidden">
						<span :class="item.class">{{ item.sample }}</span>
					</div>
				</div>
			</div>
		</section>

		<section class="space-y-4 border-t pt-8">
			<h2 class="text-heading-md font-bold">Contoh Kombinasi</h2>

			<article class="space-y-4 max-w-2xl">
				<header class="space-y-2">
					<p class="text-label-sm uppercase tracking-wider">Featured Article</p>
					<h3 class="text-heading-xl font-bold">Memahami Sistem Typography yang Baik</h3>
					<p class="text-body-sm">Published on November 26, 2026</p>
				</header>
				<p class="text-body-lg">
					Hierarchy visual yang konsisten adalah fondasi dari interface yang mudah dibaca dan intuitif.
				</p>
				<p class="text-body-md">
					Gunakan ukuran yang lebih besar untuk elemen yang lebih penting, dan ukuran yang lebih kecil untuk metadata dan informasi pendukung.
					Line-height yang longgar (28px untuk 18px font) meningkatkan readability untuk teks panjang.
				</p>
				<button class="text-label-md font-semibold text-primary-100 hover:underline">
					Baca selengkapnya →
				</button>
			</article>
		</section>

		<section class="space-y-4 border-t pt-8">
			<h2 class="text-heading-md font-bold">Font Weight (diatur terpisah)</h2>
			<p class="text-body-sm">
				Typography classes tidak mengatur <code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">font-weight</code>.
				Gunakan utility Tailwind: <code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">font-normal</code>,
				<code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">font-medium</code>,
				<code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">font-semibold</code>,
				<code class="text-label-sm bg-neutral-100 px-1.5 py-0.5 rounded-sm">font-bold</code>.
			</p>
			<div class="space-y-2">
				<p class="text-body-md font-normal">Body MD + font-normal (400)</p>
				<p class="text-body-md font-medium">Body MD + font-medium (500)</p>
				<p class="text-body-md font-semibold">Body MD + font-semibold (600)</p>
				<p class="text-body-md font-bold">Body MD + font-bold (700)</p>
			</div>
		</section>
	</div>
</template>
