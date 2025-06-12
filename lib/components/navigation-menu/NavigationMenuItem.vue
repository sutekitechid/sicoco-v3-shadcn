<template>
	<li class="cursor-pointer" @click="handleClick">
		<component :is="props.as" :to="props.to" :class="navLinkClass">
			<slot />
			<i :class="chevronIconClass" v-if="props.hasDropdown" />
		</component>
	</li>
</template>

<script setup lang="ts">
/**
 * Komponen `NavItem` adalah elemen navigasi yang digunakan untuk menampilkan tautan navigasi
 * dengan ikon, label, dan status aktif yang dapat diklik. Mendukung dropdown dan
 * status aktif yang dapat diatur ulang saat mengklik di luar elemen.
 *
 * @component
 * @example
 * <NavItem icon="si-home" label="Beranda" to="/home" :isActive="true" />
 * <NavItem icon="si-settings" label="Pengaturan" hasDropdown />
 *
 * @slots
 * @slot default - Label atau konten yang akan ditampilkan dalam elemen navigasi.
 *
 */

import {
	defineProps,
	ref,
	onMounted,
	onUnmounted,
	computed,
	HTMLAttributes,
} from 'vue'
import { cn } from '../../utils/tw-merge'

/**
 *
 * @props
 * @property {string} [icon] - Nama ikon yang akan ditampilkan di sebelah label.
 * @property {string} [label] - Label teks yang akan ditampilkan di elemen navigasi.
 * @property {string} [to] - URL tujuan untuk navigasi.
 * @property {boolean} [hasDropdown=false] - Menentukan apakah elemen memiliki dropdown.
 * @property {HTMLAttributes['class']} [class] - Kelas CSS tambahan untuk elemen utama.
 * @property {boolean} [isActive=false] - Status aktif awal elemen.
 *
 */

const props = defineProps<{
	to?: string
	hasDropdown?: boolean
	class?: HTMLAttributes['class']
	isActive?: boolean
	as?: string
}>()

/**
 *
 * @computed
 * @property {string} navLinkClass - Kelas CSS yang dikomputasi berdasarkan status aktif elemen.
 * @property {string} chevronIconClass - Kelas ikon panah yang berubah saat elemen aktif atau tidak.
 *
 */
const navLinkClass = computed(() => {
	return cn(
		'flex items-center gap-2 p-3 text-white px-5 text-sm font-semibold leading-[22px] hover:bg-primary-80',
		isActive.value ? 'bg-primary-80' : '',
		props.class
	)
})

const isActive = ref(props.isActive ?? false)
const chevronIconClass = computed(() =>
	cn(
		'si-chevron-up',
		'inline-block transition-transform duration-200',
		isActive.value ? 'rotate-0' : '-rotate-180'
	)
)

/**
 *
 * @methods
 * @method handleClick - Menangani klik pada elemen untuk mengubah status aktif jika elemen memiliki dropdown.
 * @method handleOutsideClick - Menangani klik di luar elemen untuk menonaktifkan elemen yang sedang aktif.
 *
 */
/**
 * Method untuk menangani klik dan sinkronisasi active state
 */
function handleClick() {
	if (props.hasDropdown) {
		if (isActive.value) {
			// Jika sudah aktif, nonaktifkan
			isActive.value = false
			const event = new CustomEvent('set-active-nav', {
				detail: { activeElement: null }, // Kirim null untuk menonaktifkan semua
			})
			window.dispatchEvent(event)
		} else {
			// Aktifkan elemen ini
			const event = new CustomEvent('set-active-nav', {
				detail: { activeElement: navItemId },
			})
			window.dispatchEvent(event)
		}
	}
}

/**
 * Unique ID untuk NavItem
 */
const navItemId = Symbol('NavItem')

/**
 * Listener untuk event global set-active-nav
 */
function handleSetActiveNav(event: CustomEvent) {
	// Aktifkan jika ID cocok, nonaktifkan jika tidak
	isActive.value = event.detail.activeElement === navItemId
}
function handleOutsideClick(event: MouseEvent) {
	const target = event.target as HTMLElement
	if (!target.closest('li')) {
		isActive.value = false
	}
}

/**
 *
 * @lifecycle
 * @hook onMounted - Menambahkan event listener global untuk menangani klik di luar elemen.
 * @hook onUnmounted - Menghapus event listener saat elemen dilepas dari DOM.
 *
 */
onMounted(() => {
	document.addEventListener('click', handleOutsideClick)
	window.addEventListener('set-active-nav', handleSetActiveNav)
})
onUnmounted(() => {
	document.removeEventListener('click', handleOutsideClick)
	window.removeEventListener('set-active-nav', handleSetActiveNav)
})
</script>
