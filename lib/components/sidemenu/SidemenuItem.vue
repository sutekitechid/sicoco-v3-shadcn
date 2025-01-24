<template>
	<section
		:class="{
			'border-b border-dotted dark:border-neutral-40': hasBorderBottom,
		}"
		class="flex items-center w-full"
		@click="onSelectItem"
	>
		<span :class="isActive && activeIndicator"></span>
		<component
			:is="props.as"
			:to="props.items.route"
			:href="props.items.route"
			:class="reactedClass"
		>
			{{ props.items.label }}
		</component>
		<slot name="dropdown" v-if="hasDropdown" />
	</section>
</template>

<script setup lang="ts">
/**
 * Komponen child dari Sidemenu dengan dukungan status aktif, dropdown,
 * dan navigasi kondisional menggunakan `RouterLink` atau `div`.
 */

import { computed, defineProps, defineEmits, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import type { SidemenuInterface } from '@/types/sidemenu'

/**
 * @props
 * @property {string} label - Label teks yang akan ditampilkan dalam elemen navigasi.
 * @property {string} [to=""] - Tautan tujuan untuk navigasi, menggunakan `RouterLink` jika diisi.
 * @property {boolean} [isActive=false] - Menentukan apakah elemen dalam status aktif.
 * @property {boolean} [hasDropdown=false] - Menentukan apakah elemen memiliki dropdown.
 * @property {HTMLAttributes['class']} [class=""] - Kelas tambahan untuk styling elemen utama.
 */
const props = withDefaults(
	defineProps<{
		items: SidemenuInterface
		isActive?: boolean
		hasDropdown?: boolean
		as?: string
		hasBorderBottom: boolean
	}>(),
	{
		isActive: false,
		hasDropdown: false,
		as: 'router-link',
	}
)
/**
 * @emits
 * @event click - Dipicu saat elemen diklik.
 */
const emit = defineEmits(['select'])

function onSelectItem() {
	emit('select', props.items)
}

/**
 * @computed
 * @property {string} linkTag - Menentukan tag HTML yang digunakan: `RouterLink` jika `to` diisi, atau `div` jika tidak.
 * @property {string} itemClass - Kelas CSS gabungan untuk elemen navigasi utama, mempertimbangkan status aktif dan kelas tambahan.
 * @property {string} labelClass - Kelas CSS untuk label teks dalam elemen navigasi.
 * @property {string} activeIndicator - Kelas CSS untuk indikator status aktif yang terlihat di elemen aktif.
 */
const reactedClass = computed(() =>
	cn(
		'cursor-pointer w-full text-left font-semibold block px-3 py-[0.7rem] dark:text-white',
		props.isActive && 'text-primary-100 dark:text-primary-100 relative'
	)
)
const activeIndicator = computed(() =>
	cn('w-1 mr-2 -mt-1 -ml-3 h-10 absolute bg-primary-100')
)
</script>
