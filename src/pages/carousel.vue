<script setup lang="ts">
import { defineComponent, h, inject, Transition } from 'vue'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPagination,
	CarouselPaginationPrev,
	CarouselPaginationNext,
	CAROUSEL_KEY,
} from '../../lib/components/carousel'

/** Komponen lokal — tidak butuh props di CarouselContent, cukup inject context sendiri */
const CarouselEdgeOverlay = defineComponent({
	props: { side: { type: String as () => 'left' | 'right', required: true } },
	setup(props) {
		const ctx = inject(CAROUSEL_KEY)!
		return () => {
			const visible = props.side === 'left' ? ctx.hasPrev.value : ctx.hasNext.value
			const gradient =
				props.side === 'left'
					? 'linear-gradient(to right, black 0%, transparent 100%)'
					: 'linear-gradient(to left, black 0%, transparent 100%)'
			if (!visible) return null
			return h('div', {
				class: `absolute inset-y-0 ${props.side}-0 w-16 z-10 pointer-events-none`,
				style: {
					backdropFilter: 'blur(6px)',
					WebkitBackdropFilter: 'blur(6px)',
					maskImage: gradient,
					WebkitMaskImage: gradient,
				},
			})
		}
	},
})

const slides = [
	{ id: 1, title: 'Slide 1', bg: 'bg-primary-subtle', text: 'text-primary-400', description: 'Konten slide pertama' },
	{ id: 2, title: 'Slide 2', bg: 'bg-success-subtle', text: 'text-success-400', description: 'Konten slide kedua' },
	{ id: 3, title: 'Slide 3', bg: 'bg-warning-subtle', text: 'text-warning-400', description: 'Konten slide ketiga' },
	{ id: 4, title: 'Slide 4', bg: 'bg-danger-subtle', text: 'text-danger-400', description: 'Konten slide keempat' },
	{ id: 5, title: 'Slide 5', bg: 'bg-info-subtle', text: 'text-info-400', description: 'Konten slide kelima' },
	{ id: 6, title: 'Slide 6', bg: 'bg-secondary-subtle', text: 'text-secondary-400', description: 'Konten slide keenam' },
]

const products = [
	{ id: 1, name: 'Produk A', price: 'Rp 150.000', image: 'https://placehold.co/300x200?text=Produk+A' },
	{ id: 2, name: 'Produk B', price: 'Rp 250.000', image: 'https://placehold.co/300x200?text=Produk+B' },
	{ id: 3, name: 'Produk C', price: 'Rp 350.000', image: 'https://placehold.co/300x200?text=Produk+C' },
	{ id: 4, name: 'Produk D', price: 'Rp 450.000', image: 'https://placehold.co/300x200?text=Produk+D' },
	{ id: 5, name: 'Produk E', price: 'Rp 550.000', image: 'https://placehold.co/300x200?text=Produk+E' },
]

const banners = [
	{ id: 1, src: 'https://placehold.co/1200x400/1a6cf7/white?text=Banner+1', alt: 'Banner 1' },
	{ id: 2, src: 'https://placehold.co/1200x400/22c55e/white?text=Banner+2', alt: 'Banner 2' },
	{ id: 3, src: 'https://placehold.co/1200x400/eab308/white?text=Banner+3', alt: 'Banner 3' },
]
</script>

<template>
	<div class="max-w-4xl mx-auto p-8 space-y-16">
		<h1 class="text-3xl font-bold">Carousel Demo</h1>

		<!-- ─────────────────────────────────────────
		     0. Tanpa pagination — scroll bebas / drag
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">0. Tanpa pagination</h2>
			<Carousel :items-per-view="3.5" :gap="16">
				<CarouselContent>
					<CarouselItem v-for="product in products" :key="product.id">
						<div class="border border-main rounded-xl overflow-hidden shadow-xs">
							<img :src="product.image" :alt="product.name" class="w-full object-cover" />
							<div class="p-3">
								<p class="font-semibold">{{ product.name }}</p>
								<p class="text-sm text-main dark:text-neutral-500">{{ product.price }}</p>
							</div>
						</div>
					</CarouselItem>
				</CarouselContent>
				<!-- tidak ada CarouselPagination sama sekali -->
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     0b. Center + spoiler — Cara 1: CSS mask-image via class prop
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">0b-1. Spoiler — CSS mask-image (tanpa props, tanpa JS)</h2>
			<p class="text-sm text-main dark:text-neutral-500">
				Cukup tambahkan Tailwind arbitrary CSS di <code>class</code> prop yang sudah ada.
				Fade selalu tampil di kedua sisi.
			</p>
			<Carousel
				:items-per-view="1.4"
				:gap="16"
				:opts="{ align: 'center', containScroll: false }"
			>
				<!--
					[mask-image:...] memudarkan konten di tepi secara CSS murni.
					Tidak butuh prop baru, tidak butuh JS.
				-->
				<CarouselContent
					class="
						[mask-image:linear-gradient(to_right,transparent_0%,black_14%,black_86%,transparent_100%)]
						[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_14%,black_86%,transparent_100%)]
					"
				>
					<CarouselItem v-for="slide in slides" :key="slide.id">
						<div
							:class="['h-48 rounded-xl flex flex-col items-center justify-center', slide.bg]"
						>
							<p class="text-2xl font-bold">{{ slide.title }}</p>
							<p class="text-sm opacity-70">{{ slide.description }}</p>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPagination class="mt-4 flex justify-center gap-2">
					<template #indicator="{ currentSnap, totalSnaps, scrollTo }">
						<button
							v-for="i in totalSnaps"
							:key="i"
							:class="[
								'h-2 rounded-full transition-all duration-200',
								currentSnap === i - 1 ? 'w-4 bg-primary-300' : 'w-2 bg-neutral-300 hover:bg-neutral-500',
							]"
							@click="scrollTo(i - 1)"
						/>
					</template>
				</CarouselPagination>
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     0b-2. Cara 2: useCarousel() composable — reaktif per sisi
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">0b-2. Spoiler — useCarousel() reaktif (tanpa props)</h2>
			<p class="text-sm text-main dark:text-neutral-500">
				Buat komponen lokal atau inline block yang memakai <code>useCarousel()</code>.
				Overlay muncul/hilang reaktif berdasarkan <code>hasPrev</code> / <code>hasNext</code>.
			</p>
			<Carousel
				:items-per-view="1.4"
				:gap="16"
				:opts="{ align: 'center', containScroll: false }"
			>
				<div class="relative">
					<CarouselContent>
						<CarouselItem v-for="slide in slides" :key="slide.id">
							<div
								:class="['h-48 rounded-xl flex flex-col items-center justify-center', slide.bg]"
							>
								<p class="text-2xl font-bold">{{ slide.title }}</p>
								<p class="text-sm opacity-70">{{ slide.description }}</p>
							</div>
						</CarouselItem>
					</CarouselContent>

					<!-- Overlay kiri — pakai useCarousel() langsung di template -->
					<CarouselEdgeOverlay side="left" />
					<CarouselEdgeOverlay side="right" />
				</div>
				<CarouselPagination class="mt-4 flex justify-center gap-2">
					<template #indicator="{ currentSnap, totalSnaps, scrollTo }">
						<button
							v-for="i in totalSnaps"
							:key="i"
							:class="[
								'h-2 rounded-full transition-all duration-200',
								currentSnap === i - 1 ? 'w-4 bg-primary-300' : 'w-2 bg-neutral-300 hover:bg-neutral-500',
							]"
							@click="scrollTo(i - 1)"
						/>
					</template>
				</CarouselPagination>
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     1. Indikator: dots bulat standar
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">1. Indikator: dots bulat standar</h2>
			<Carousel :items-per-view="1" :loop="true" :gap="0">
				<CarouselContent>
					<CarouselItem v-for="slide in slides" :key="slide.id">
						<div
							:class="['h-48 rounded-xl flex flex-col items-center justify-center', slide.bg, slide.text]"
						>
							<p class="text-2xl font-bold">{{ slide.title }}</p>
							<p class="text-sm opacity-80">{{ slide.description }}</p>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPagination class="mt-4 flex justify-center gap-2">
					<template #indicator="{ currentSnap, totalSnaps, scrollTo }">
						<button
							v-for="i in totalSnaps"
							:key="i"
							:class="[
								'h-2 rounded-full transition-all duration-200',
								currentSnap === i - 1 ? 'w-4 bg-primary-300' : 'w-2 bg-neutral-300 hover:bg-neutral-500',
							]"
							:aria-label="`Ke slide ${i}`"
							@click="scrollTo(i - 1)"
						/>
					</template>
				</CarouselPagination>
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     2. Indikator: angka (n / total)
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">2. Indikator: angka (n / total)</h2>
			<Carousel :items-per-view="1" :loop="false" :gap="0">
				<CarouselContent>
					<CarouselItem v-for="slide in slides" :key="slide.id">
						<div
							:class="['h-48 rounded-xl flex flex-col items-center justify-center', slide.bg, slide.text]"
						>
							<p class="text-2xl font-bold">{{ slide.title }}</p>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPagination class="mt-4 flex justify-center gap-3">
					<template #indicator="{ currentSnap, totalSnaps }">
						<span class="text-sm font-medium text-neutral-600 min-w-[3rem] text-center">
							{{ currentSnap + 1 }} / {{ totalSnaps }}
						</span>
					</template>
				</CarouselPagination>
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     3. Indikator: thumbnail gambar
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">3. Indikator: thumbnail gambar</h2>
			<Carousel :items-per-view="1" :loop="true" :gap="0">
				<CarouselContent>
					<CarouselItem v-for="banner in banners" :key="banner.id">
						<img :src="banner.src" :alt="banner.alt" class="w-full rounded-xl object-cover" />
					</CarouselItem>
				</CarouselContent>
				<CarouselPagination class="mt-3 flex justify-center gap-2">
					<template #indicator="{ currentSnap, scrollTo }">
						<button
							v-for="(banner, i) in banners"
							:key="banner.id"
							:class="[
								'w-14 h-9 rounded-sm overflow-hidden ring-2 transition-all',
								currentSnap === i ? 'ring-primary' : 'ring-transparent opacity-60 hover:opacity-100',
							]"
							:aria-label="`Ke slide ${i + 1}`"
							@click="scrollTo(i)"
						>
							<img :src="banner.src" :alt="banner.alt" class="w-full h-full object-cover" />
						</button>
					</template>
				</CarouselPagination>
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     4. Multi-item — 3 item sekaligus
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">4. Multi-item — 3 item sekaligus</h2>
			<Carousel :items-per-view="3" :gap="16">
				<CarouselContent>
					<CarouselItem v-for="product in products" :key="product.id">
						<div class="border border-main rounded-xl overflow-hidden shadow-xs">
							<img :src="product.image" :alt="product.name" class="w-full object-cover" />
							<div class="p-3">
								<p class="font-semibold">{{ product.name }}</p>
								<p class="text-sm text-main dark:text-neutral-500">{{ product.price }}</p>
							</div>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPagination class="mt-4 flex justify-center gap-2">
					<template #indicator="{ currentSnap, totalSnaps, scrollTo }">
						<button
							v-for="i in totalSnaps"
							:key="i"
							:class="[
								'h-2 rounded-full transition-all duration-200',
								currentSnap === i - 1 ? 'w-4 bg-primary-300' : 'w-2 bg-neutral-300 hover:bg-neutral-500',
							]"
							@click="scrollTo(i - 1)"
						/>
					</template>
				</CarouselPagination>
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     5. Banner overlaid — dots + prev/next di atas gambar
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">5. Banner — pagination overlaid (absolute)</h2>
			<Carousel :items-per-view="1" :loop="true" :gap="0" class="relative">
				<CarouselContent>
					<CarouselItem v-for="banner in banners" :key="banner.id">
						<img :src="banner.src" :alt="banner.alt" class="w-full rounded-xl object-cover" />
					</CarouselItem>
				</CarouselContent>
				<CarouselPagination
					class="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10"
				>
					<template #indicator="{ currentSnap, totalSnaps, scrollTo }">
						<button
							v-for="i in totalSnaps"
							:key="i"
							:class="[
								'h-2 rounded-full transition-all duration-200',
								currentSnap === i - 1 ? 'w-5 bg-white' : 'w-2 bg-white/50',
							]"
							@click="scrollTo(i - 1)"
						/>
					</template>
				</CarouselPagination>
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     6. Prev/Next di sisi kiri-kanan, dots di bawah
		        (individual primitives)
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">6. Prev/Next di sisi kiri-kanan, indikator di bawah</h2>
			<p class="text-sm text-neutral-500">
				<code>loop=false</code> → tombol Prev disabled di slide pertama, tombol Next disabled di slide terakhir.
				<code>hasPrev</code> / <code>hasNext</code> tersedia di context via <code>useCarousel()</code>.
			</p>
			<Carousel :items-per-view="1" :loop="false" :gap="0" class="relative px-12">
				<CarouselPaginationPrev class="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
				<CarouselContent>
					<CarouselItem v-for="slide in slides" :key="slide.id">
						<div
							:class="['h-48 rounded-xl flex flex-col items-center justify-center', slide.bg, slide.text]"
						>
							<p class="text-2xl font-bold">{{ slide.title }}</p>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPaginationNext class="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
				<!-- Indikator di bawah memakai wrapper CarouselPagination, sementara prev/next dirender terpisah -->
				<CarouselPagination class="mt-4 flex justify-center">
					<template #prev /><template #next />
					<template #indicator="{ currentSnap, totalSnaps, scrollTo }">
						<div class="flex gap-1.5">
							<button
								v-for="i in totalSnaps"
								:key="i"
								:class="[
									'h-1.5 rounded-full transition-all duration-300',
									currentSnap === i - 1 ? 'w-8 bg-primary-300' : 'w-2 bg-neutral-300',
								]"
								@click="scrollTo(i - 1)"
							/>
						</div>
					</template>
				</CarouselPagination>
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     7. Default scoped slot — layout penuh custom
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">7. Default slot — full custom layout</h2>
			<Carousel :items-per-view="2" :gap="16">
				<CarouselContent>
					<CarouselItem v-for="product in products" :key="product.id">
						<div class="border border-main rounded-xl overflow-hidden shadow-xs">
							<img :src="product.image" :alt="product.name" class="w-full object-cover" />
							<div class="p-3">
								<p class="font-semibold">{{ product.name }}</p>
								<p class="text-sm text-main dark:text-neutral-500">{{ product.price }}</p>
							</div>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPagination
					v-slot="{ scrollPrev, scrollNext, hasPrev, hasNext, currentSnap, totalSnaps }"
					class="mt-4 flex items-center justify-between px-1"
				>
					<button
					:disabled="!hasPrev"
					:class="[
						'text-sm font-medium transition-colors',
						hasPrev ? 'text-primary-300 hover:text-primary-400' : 'text-neutral-300 cursor-not-allowed',
						]"
						@click="scrollPrev"
					>
						← Sebelumnya
					</button>
					<span class="text-sm text-neutral-500">{{ currentSnap + 1 }} / {{ totalSnaps }}</span>
					<button
					:disabled="!hasNext"
					:class="[
						'text-sm font-medium transition-colors',
						hasNext ? 'text-primary-300 hover:text-primary-400' : 'text-neutral-300 cursor-not-allowed',
						]"
						@click="scrollNext"
					>
						Berikutnya →
					</button>
				</CarouselPagination>
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     8. Autoplay
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">8. Autoplay</h2>
			<p class="text-sm text-main dark:text-neutral-500">
				<code>:autoplay="3000"</code> — auto-advance tiap 3 detik.
				Pause otomatis saat hover/focus (bisa dimatikan dengan <code>:pause-on-hover="false"</code>).
			</p>
			<Carousel :items-per-view="1" :loop="true" :gap="0" :autoplay="3000">
				<CarouselContent>
					<CarouselItem v-for="banner in banners" :key="banner.id">
						<img :src="banner.src" :alt="banner.alt" class="w-full rounded-xl object-cover" />
					</CarouselItem>
				</CarouselContent>
				<CarouselPagination class="mt-3 flex justify-center gap-2">
					<template #indicator="{ currentSnap, totalSnaps, scrollTo }">
						<button
							v-for="i in totalSnaps"
							:key="i"
							:class="[
								'h-2 rounded-full transition-all duration-200',
								currentSnap === i - 1 ? 'w-4 bg-primary-300' : 'w-2 bg-neutral-300 hover:bg-neutral-500',
							]"
							@click="scrollTo(i - 1)"
						/>
					</template>
				</CarouselPagination>
			</Carousel>
		</section>

		<!-- ─────────────────────────────────────────
		     9. Vertical carousel
		     ───────────────────────────────────────── -->
		<section class="space-y-3">
			<h2 class="text-lg font-semibold">9. Vertical carousel</h2>
			<Carousel orientation="vertical" :items-per-view="2" :gap="16" class="relative">
				<CarouselContent class="h-64">
					<CarouselItem v-for="slide in slides" :key="slide.id">
						<div
							:class="['h-28 rounded-xl flex items-center justify-center', slide.bg, slide.text]"
						>
							<p class="text-lg font-bold">{{ slide.title }}</p>
						</div>
					</CarouselItem>
				</CarouselContent>
				<CarouselPagination class="mt-4 flex justify-center gap-2">
					<template #indicator="{ currentSnap, totalSnaps, scrollTo }">
						<button
							v-for="i in totalSnaps"
							:key="i"
							:class="[
								'h-2 rounded-full transition-all duration-200',
								currentSnap === i - 1 ? 'w-4 bg-primary-300' : 'w-2 bg-neutral-300',
							]"
							@click="scrollTo(i - 1)"
						/>
					</template>
				</CarouselPagination>
			</Carousel>
		</section>
	</div>
</template>
