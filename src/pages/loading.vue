<template>
	<div class="flex max-w-4xl flex-col gap-8 p-4 sm:p-6">
		<div>
			<h2 class="text-2xl font-semibold text-main">Loading</h2>
			<p class="text-main">
				Gunakan loading untuk menandai proses yang sedang berjalan dan mencegah
				interaksi sementara.
			</p>
		</div>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Loading overlay</h3>
			<p class="mb-4 text-sm text-main">
				Tombol ini menampilkan loading selama dua detik sebagai simulasi proses
				penyimpanan.
			</p>
			<Button :disabled="isLoading" @click="showLoading">Simpan perubahan</Button>
			<p v-if="isLoading" class="mt-3 text-sm text-neutral-600">
				Menyimpan perubahan...
			</p>
		</section>

		<Loading ref="loadingRef" @update:active="isLoading = $event" />
	</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import Button from '@/components/button/Button.vue'
import Loading from '@/components/loading/Loading.vue'

const loadingRef = ref<InstanceType<typeof Loading> | null>(null)
const isLoading = ref(false)
let loadingTimeout: ReturnType<typeof setTimeout> | undefined

const showLoading = () => {
	loadingRef.value?.open()
	// loadingTimeout = setTimeout(() => loadingRef.value?.close(), 2000)
}

onBeforeUnmount(() => {
	if (loadingTimeout) {
		clearTimeout(loadingTimeout)
	}
})
</script>
