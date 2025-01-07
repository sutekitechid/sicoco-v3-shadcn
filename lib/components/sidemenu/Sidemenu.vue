<template>
	<aside :class="sidenavClass">
		<template v-for="(item, index) in items" :key="index">
			<SidemenuItem
				:label="item.label"
				:to="item.to"
				:isActive="activeIndex === index"
				:itemClass="props.itemClass"
				@click="handleClick(index)"
			/>
			<div
				v-if="index < items.length - 1"
				:class="
					cn('w-[85%] ml-3 border-b border-dotted dark:border-neutral-40')
				"
			></div>
		</template>
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
		items?: { label: string; to: string }[]
		defaultActiveIndex?: number
		class?: HTMLAttributes['class']
		itemClass?: HTMLAttributes['class']
	}>(),
	{
		items: () => [{ label: '', to: '' }],
		defaultActiveIndex: 0,
		class: '',
		itemClass: '',
	}
)
/**
 * @emits
 * @event update:activeIndex - Dipicu saat indeks item aktif diperbarui.
 */
const emit = defineEmits(['update:activeIndex'])
const activeIndex = ref(props.defaultActiveIndex)

/**
 * @param index
 * @methods
 * @method handleClick - Memperbarui indeks item aktif dan memicu event `update:activeIndex`.
 */
function handleClick(index: number) {
	activeIndex.value = index
	emit('update:activeIndex', index)
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
