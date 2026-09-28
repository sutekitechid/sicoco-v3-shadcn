<template>
	<Dialog :open="loadingOpen" :show-close="false">
		<DialogContent
			class="rounded-xl w-36! h-36! gap-0 p-0 flex justify-center items-center top-1/2 -translate-y-1/2"
			z-index="100"
		>
			<div class="loader"></div>
		</DialogContent>
	</Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '@/components/dialog/Dialog.vue'
import DialogContent from '@/components/dialog/DialogContent.vue'

defineProps<{ active?: boolean }>()

const emit = defineEmits<{
	'update:active': [value: boolean]
}>()

const loadingOpen = ref(false)

function open() {
	start()
	return { open, close, start, finish }
}

function close() {
	finish()
}

function start() {
	loadingOpen.value = true
	emit('update:active', true)
}

function finish() {
	loadingOpen.value = false
	emit('update:active', false)
}

defineExpose({ open, close, start, finish })
</script>

<style>
.loader {
	width: 40px;
	height: 40px;
	--c: no-repeat linear-gradient(rgb(var(--color-primary-500)) 0 0);
	background: var(--c), var(--c), var(--c), var(--c);
	background-size: 21px 21px;
	animation: l5 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
}
@keyframes l5 {
	0% {
		background-position: 0 0, 100% 0, 100% 100%, 0 100%;
	}
	33% {
		background-position: 0 0, 100% 0, 100% 100%, 0 100%;
		width: 60px;
		height: 60px;
	}
	66% {
		background-position: 100% 0, 100% 100%, 0 100%, 0 0;
		width: 60px;
		height: 60px;
	}
	100% {
		background-position: 100% 0, 100% 100%, 0 100%, 0 0;
	}
}
</style>
