<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">Sizes</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="lg">Largest button I even seen</Button>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Variants (Solid)</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button variant="default">Default</Button>
				<Button variant="primary">Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="danger">Danger</Button>
				<Button variant="warning">Warning</Button>
				<Button variant="success">Success</Button>
				<Button disabled>Disabled</Button>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Variants (Outlined)</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button outlined>Default</Button>
				<Button outlined variant="primary">Primary</Button>
				<Button outlined variant="secondary">Secondary</Button>
				<Button outlined variant="danger">Danger</Button>
				<Button outlined variant="warning">Warning</Button>
				<Button outlined variant="success">Success</Button>
				<Button outlined disabled>Disabled</Button>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Text + Icon</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button>
					<i class="si-search" />
					Search
				</Button>
				<Button variant="primary">
					<i class="si-save" />
					Save
				</Button>
				<Button variant="success">
					<i class="si-check" />
					Approve
				</Button>
				<Button variant="danger">
					<i class="si-delete" />
					Delete
				</Button>
				<Button outlined variant="primary">
					<i class="si-edit" />
					Edit
				</Button>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Icon Only</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button size="sm" aria-label="Search">
					<i class="si-search" />
				</Button>
				<Button size="md" aria-label="Save">
					<i class="si-save" />
				</Button>
				<Button size="lg" aria-label="Settings">
					<i class="si-settings" />
				</Button>
				<Button outlined variant="primary" aria-label="Edit">
					<i class="si-edit" />
				</Button>
				<Button variant="danger" aria-label="Delete">
					<i class="si-delete" />
				</Button>
				<Button disabled aria-label="Disabled">
					<i class="si-lock" />
				</Button>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Text + Icon (Trailing)</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button variant="primary">
					Next
					<i class="si-arrow-right" />
				</Button>
				<Button variant="secondary" outlined>
					Download
					<i class="si-download" />
				</Button>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import Button from '@/components/button/Button.vue'
</script>
