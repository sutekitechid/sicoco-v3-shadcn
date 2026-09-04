<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/button'
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/drawer'

const open = ref(false)
</script>

<template>
	<div class="flex max-w-4xl flex-col gap-6 p-4 sm:p-6">
		<div>
			<h2 class="text-heading-md font-semibold text-main">Drawer</h2>
			<p class="text-body-md text-secondary">Panel modal yang muncul dari bawah layar.</p>
		</div>
		<Drawer v-model:open="open">
			<DrawerTrigger as-child>
				<Button>Buka drawer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerTitle>Pilih Tanggal</DrawerTitle>
				<DrawerClose />
				<p class="mt-4 text-body-md text-secondary">Konten drawer dapat ditutup dengan tombol X, klik luar, Escape, atau swipe ke bawah.</p>
			</DrawerContent>
		</Drawer>
	</div>
</template>
