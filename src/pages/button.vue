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
				<Button variant="neutral">Neutral</Button>
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
			<h3 class="font-semibold text-lg mb-3">Variants (Secondary)</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button variant="secondary-primary">Primary</Button>
				<Button variant="secondary-secondary">Secondary</Button>
				<Button variant="secondary-danger">Danger</Button>
				<Button variant="secondary-warning">Warning</Button>
				<Button variant="secondary-success">Success</Button>
				<Button variant="secondary-primary" disabled>Disabled</Button>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Variants (Tertiary)</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button variant="tertiary-primary">Primary</Button>
				<Button variant="tertiary-secondary">Secondary</Button>
				<Button variant="tertiary-danger">Danger</Button>
				<Button variant="tertiary-warning">Warning</Button>
				<Button variant="tertiary-success">Success</Button>
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<Button size="sm" variant="tertiary-primary">Primary Sm</Button>
				<Button size="md" variant="tertiary-primary">Primary Md</Button>
				<Button size="lg" variant="tertiary-primary">Primary Lg</Button>
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<Button size="sm" variant="tertiary-primary" icon-left="si-heroicon-outline-arrow-right"
					>Primary Icon Left</Button
				>
				<Button
					size="sm"
					variant="tertiary-primary"
					icon="si-heroicon-outline-arrow-right"
					icon-position="right"
					>Primary Icon Right</Button
				>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Variants (Link)</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button variant="link-primary" as="router-link" to="https://google.com">Primary</Button>
				<Button variant="link-secondary">Secondary</Button>
				<Button variant="link-danger">Danger</Button>
				<Button variant="link-warning">Warning</Button>
				<Button variant="link-success">Success</Button>
				<Button variant="link-neutral">Neutral</Button>
				<Button variant="link-primary" disabled>Disabled</Button>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Text + Icon Left</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button size="sm">
					<template #icon-left>
						<i class="si-heroicon-outline-magnifying-glass" />
					</template>
					Search
				</Button>
				<Button variant="primary" size="sm">
					<template #icon-left>
						<i class="si-save p-1" />
					</template>
					Save
				</Button>
				<Button variant="success">
					<template #icon-left>
						<i class="si-heroicon-outline-check" />
					</template>
					Approve
				</Button>
				<Button variant="danger">
					<template #icon-left>
						<i class="si-heroicon-solid-trash" />
					</template>
					Delete
				</Button>
				<Button outlined variant="primary" size="lg">
					<template #icon-left>
						<i class="si-heroicon-outline-pencil-square" />
					</template>
					Edit
				</Button>
				<Button variant="neutral" size="lg">
					<template #icon-left>
						<i class="si-heroicon-outline-cog-6-tooth" />
					</template>
					Settings
				</Button>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Text + Icon Right</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button size="sm">
					<template #icon-right>
						<i class="si-heroicon-outline-magnifying-glass" />
					</template>
					Search
				</Button>
				<Button variant="primary" size="sm">
					<template #icon-right>
						<i class="si-save p-1" />
					</template>
					Save
				</Button>
				<Button variant="success">
					<template #icon-right>
						<i class="si-heroicon-outline-check" />
					</template>
					Approve
				</Button>
				<Button variant="danger">
					<template #icon-right>
						<i class="si-heroicon-solid-trash" />
					</template>
					Delete
				</Button>
				<Button outlined variant="primary" size="lg">
					<template #icon-right>
						<i class="si-heroicon-outline-pencil-square" />
					</template>
					Edit
				</Button>
				<Button variant="neutral" size="lg">
					<template #icon-right>
						<i class="si-heroicon-outline-cog-6-tooth" />
					</template>
					Settings
				</Button>
			</div>
		</section>


		<section>
			<h3 class="font-semibold text-lg mb-3">Text + Icon</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button size="sm">
					<template #icon-left>
						<i class="si-heroicon-outline-chevron-left" />
					</template>
					<template #icon-right>
						<i class="si-heroicon-outline-chevron-right" />
					</template>
					Small
				</Button>
				<Button variant="primary">
					<template #icon-left>
						<i class="si-heroicon-outline-chevron-left" />
					</template>
					<template #icon-right>
						<i class="si-heroicon-outline-chevron-right" />
					</template>
					Medium
				</Button>
				<Button variant="success" size="lg">
					<template #icon-left>
						<i class="si-heroicon-outline-chevron-left" />
					</template>
					<template #icon-right>
						<i class="si-heroicon-outline-chevron-right" />
					</template>
					Large Button
				</Button>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Icon Only</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button size="sm">
					<template #icon-left>
						<i class="icon si-heroicon-outline-magnifying-glass" />
					</template>
				</Button>
				<Button variant="primary" size="sm">
					<template #icon-left>
						<i class="si-save" />
					</template>
				</Button>
				<Button variant="success">
					<template #icon-left>
						<i class="si-heroicon-outline-check" />
					</template>
				</Button>
				<Button variant="danger">
					<template #icon-left>
						<i class="si-heroicon-solid-trash" />
					</template>
				</Button>
				<Button outlined variant="primary" size="lg">
					<template #icon-left>
						<i class="si-heroicon-outline-pencil-square" />
					</template>
				</Button>
				<Button variant="neutral" size="lg">
					<template #icon-left>
						<i class="si-heroicon-outline-cog-6-tooth" />
					</template>
				</Button>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Text + Icon (Trailing)</h3>
			<div class="flex flex-wrap items-center gap-3">
				<Button variant="primary">
					Next
					<i class="icon si-arrow-right" />
				</Button>
				<Button variant="secondary" outlined>
					Download
					<i class="si-download" />
				</Button>
				<Button variant="neutral">
					More
					<i class="si-arrow-right" />
				</Button>
		</div>
	</section>
	</div>
</template>

<script setup lang="ts">
import Button from '@/components/button/Button.vue'
</script>
