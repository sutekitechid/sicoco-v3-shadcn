<template>
  <li :class="[props.class, 'cursor-pointer']" @click="handleClick">
    <component :is="linkTag" :to="props.to" :class="navLinkClass">
      <i :class="props.icon" v-if="props.icon" />
      <slot>{{ props.label }}</slot>
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
 * @props
 * @property {string} [icon] - Nama ikon yang akan ditampilkan di sebelah label.
 * @property {string} [label] - Label teks yang akan ditampilkan di elemen navigasi.
 * @property {string} [to] - URL tujuan untuk navigasi.
 * @property {boolean} [hasDropdown=false] - Menentukan apakah elemen memiliki dropdown.
 * @property {HTMLAttributes['class']} [class] - Kelas CSS tambahan untuk elemen utama.
 * @property {boolean} [isActive=false] - Status aktif awal elemen.
 *
 * @slots
 * @slot default - Label atau konten yang akan ditampilkan dalam elemen navigasi.
 *
 * @methods
 * @method handleClick - Menangani klik pada elemen untuk mengubah status aktif jika elemen memiliki dropdown.
 * @method handleOutsideClick - Menangani klik di luar elemen untuk menonaktifkan elemen yang sedang aktif.
 *
 * @computed
 * @property {string} navLinkClass - Kelas CSS yang dikomputasi berdasarkan status aktif elemen.
 * @property {string} chevronIconClass - Kelas ikon panah yang berubah saat elemen aktif atau tidak.
 *
 * @lifecycle
 * @hook onMounted - Menambahkan event listener global untuk menangani klik di luar elemen.
 * @hook onUnmounted - Menghapus event listener saat elemen dilepas dari DOM.
 */

import { defineProps, ref, onMounted, onUnmounted, computed } from 'vue'
import { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
  icon?: string
  label?: string
  to?: string
  hasDropdown?: boolean
  class?: HTMLAttributes['class']
  isActive?: boolean
}>()

const navLinkClass = computed(() => {
  return cn(
    props.class,
    'flex',
    'items-center',
    'gap-2',
    'py-[0.75rem]',
    'px-3',
    'text-white',
    'hover:bg-primary-80',
    isActive.value ? 'bg-primary-80' : ''
  )
})

const linkTag = computed(() => (props.to ? 'RouterLink' : 'div'))

const isActive = ref(props.isActive ?? false)

const chevronIconClass = computed(() =>
  isActive.value ? 'si-chevron-up' : 'si-chevron-down'
)

function handleClick() {
  if (props.hasDropdown) {
    isActive.value = !isActive.value
  }
}

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('li')) {
    isActive.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>
