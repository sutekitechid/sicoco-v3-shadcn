<template>
	<Dialog :open="loadingOpen">
		<DialogContent
			class="rounded-[0.75rem] w-32 h-32 gap-0 bg-white p-0 justify-center"
		>
			<div class="loader"></div>
		</DialogContent>
	</Dialog>
</template>

<script lang="ts">
import Dialog from '@/components/dialog/Dialog.vue'
import DialogContent from '@/components/dialog/DialogContent.vue'

/**
 * Loading component
 */
export default {
	components: {
		Dialog,
		DialogContent,
	},
	props: {
		/**
		 * Loading state
		 */
		active: Boolean,
	},
	data() {
		return {
			loadingOpen: false,
		}
	},
	methods: {
		open() {
			this.start()
			return this
		},
		close() {
			this.finish()
		},
		start() {
			this.loadingOpen = true
			this.$emit('update:active', true)
		},
		finish() {
			this.loadingOpen = false
			this.$emit('update:active', false)
		},
	},
}
</script>

<style>
.loader {
	width: 40px;
	height: 40px;
	--c: no-repeat linear-gradient(rgb(var(--color-primary-100)) 0 0);
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
