<template>
	<aside :class="sidenavClass">
		<SidemenuItem
			v-for="(item, index) in props.items"
			:key="index"
			:items="item"
			:is-active="isActive(item.value)"
			:has-border-bottom="props.items.length !== index + 1"
			@select="onSelect"
		/>

		<slot />
	</aside>
</template>

<script setup lang="ts">
/**
 * Komponen `Sidemenu`, yang digunakan untuk membuat sidebar
 * dengan daftar item navigasi yang dapat dipilih, mendukung status aktif
 * dan pemutakhiran indeks aktif.
 * @example
 * const menuItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Finance', to: '/finance' },
  { label: 'Employee', to: '/employee' },
   ]
 * <Sidemenu :items="menuItems" :defaultActiveIndex="0" />
 */
import {
	ref,
	defineProps,
	defineEmits,
	computed,
	type HTMLAttributes,
} from 'vue'
import { useVModel } from '@vueuse/core'
import type { SidemenuInterface } from '@/types/sidemenu'
import { cn } from '../../utils/tw-merge'
import SidemenuItem from './SidemenuItem.vue'

/**
 * @props
 * @property {Array<{label: string; to: string}>} [items=[]] - Daftar item navigasi yang akan ditampilkan di menu samping.
 * @property {number} [defaultActiveIndex=0] - Indeks awal item yang aktif.
 * @property {HTMLAttributes['class']} [class=""] - Kelas CSS tambahan untuk elemen menu samping.
 * @property {HTMLAttributes['itemClass']} [itemClass=""] - tambahkan juga itemClass sebagai props jika ingin mengatur setiap item dengan CSS.
 */

const props = withDefaults(
	defineProps<{
		modelValue: string
		items?: SidemenuInterface[]
		class?: HTMLAttributes['class']
	}>(),
	{
		modelValue: '',
		class: '',
	}
)
/**
 * @emits
 * @event update:activeIndex - Dipicu saat indeks item aktif diperbarui.
 */
const emit = defineEmits(['update:modelValue', 'select'])

const computedModelValue = useVModel(props, 'modelValue', emit)
/**
 * @param index
 * @methods
 * @method handleClick - Memperbarui indeks item aktif dan memicu event `update:activeIndex`.
 */
function onSelect(value: SidemenuInterface) {
	computedModelValue.value = value.value
	emit('select', value)
}

const isActive = (value: string) => {
	return computedModelValue.value === value
}
/**
 * @computed
 * @property {string} sidenavClass - Kelas CSS gabungan untuk elemen menu samping, memperhitungkan kelas tambahan.
 */
const sidenavClass = computed(() =>
	cn(
		'flex flex-col items-start bg-white p-3 w-full rounded-md h-[450px] max-w-[200px] dark:bg-transparent',
		props.class
	)
)
</script>
