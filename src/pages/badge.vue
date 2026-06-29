<template>
	<div class="flex flex-col gap-6 p-4">
		<div>
			<h3 class="font-semibold text-lg mb-3">Badge Variants (Soft/Default)</h3>
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="default">Default</Badge>
				<Badge variant="primary">Primary</Badge>
				<Badge variant="success">Success</Badge>
				<Badge variant="warning">Warning</Badge>
				<Badge variant="danger">Danger</Badge>
				<Badge variant="secondary">Secondary</Badge>
				<Badge variant="grey">Grey</Badge>
				<Badge variant="gray">Gray</Badge>
				<Badge variant="neutral">Neutral</Badge>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-lg mb-3">Badge Variants (Solid)</h3>
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="solid">Solid (= primary solid)</Badge>
				<Badge variant="primary solid">Primary Solid</Badge>
				<Badge variant="success solid">Success Solid</Badge>
				<Badge variant="warning solid">Warning Solid</Badge>
				<Badge variant="danger solid">Danger Solid</Badge>
				<Badge variant="secondary solid">Secondary Solid</Badge>
				<Badge variant="grey solid">Grey Solid</Badge>
				<Badge variant="gray solid">Gray Solid</Badge>
				<Badge variant="neutral solid">Neutral Solid (bg-neutral-950)</Badge>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-lg mb-3">Solid + Closeable + Sizes</h3>
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="solid" size="small" closeable>Solid Small</Badge>
				<Badge variant="success solid" size="medium" closeable>Success Medium</Badge>
				<Badge variant="danger solid" size="large" closeable>Danger Large Rounded</Badge>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-lg mb-3">Squared</h3>
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="primary" :rounded="false">Rounded Primary</Badge>
				<Badge variant="success solid" :rounded="false" closeable>Rounded Success Solid</Badge>
				<Badge variant="danger" :rounded="false">Danger Pill</Badge>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Badge from '@/components/badge/Badge.vue'
</script>
