<template>
	<div class="flex flex-col gap-8 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">Triggers</h3>
			<div class="flex flex-wrap items-center gap-6">
				<Tooltip trigger="hover">
					<template #trigger>
						<Button data-cy="tooltip-hover-trigger" data-testid="tooltip-hover-trigger">
							Hover me
						</Button>
					</template>
					<TooltipContent>
						<p class="text-label-md font-medium">
							Default tooltip
						</p>
						<p>Muncul saat hover (default tooltip behavior).</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip trigger="click">
					<template #trigger>
						<Button variant="primary" data-cy="tooltip-click-trigger" data-testid="tooltip-click-trigger">
							Click me
						</Button>
					</template>
					<TooltipContent>Muncul saat click. Klik di luar untuk menutup.</TooltipContent>
				</Tooltip>

				<Tooltip trigger="focus">
					<template #trigger>
						<Button variant="secondary" data-cy="tooltip-focus-trigger" data-testid="tooltip-focus-trigger">
							Focus me
						</Button>
					</template>
					<TooltipContent>Muncul saat trigger difokuskan (tab/keyboard).</TooltipContent>
				</Tooltip>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Positions</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Atur posisi tooltip menggunakan prop <code>position</code> pada
				<code>TooltipContent</code>.
			</p>
			<div class="grid grid-cols-3 gap-8 place-items-center min-h-[200px]">
				<div></div>
				<Tooltip>
					<template #trigger>
						<Button data-cy="tooltip-top" data-testid="tooltip-top">Top</Button>
					</template>
					<TooltipContent position="top">Tooltip di atas trigger.</TooltipContent>
				</Tooltip>
				<div></div>

				<Tooltip>
					<template #trigger>
						<Button variant="primary" data-cy="tooltip-left" data-testid="tooltip-left">
							Left
						</Button>
					</template>
					<TooltipContent position="left">Tooltip di kiri trigger.</TooltipContent>
				</Tooltip>
				<div class="text-sm text-neutral-500">trigger area</div>
				<Tooltip>
					<template #trigger>
						<Button variant="success" data-cy="tooltip-right" data-testid="tooltip-right">
							Right
						</Button>
					</template>
					<TooltipContent position="right">Tooltip di kanan trigger.</TooltipContent>
				</Tooltip>

				<div></div>
				<Tooltip>
					<template #trigger>
						<Button variant="danger" data-cy="tooltip-bottom" data-testid="tooltip-bottom">
							Bottom
						</Button>
					</template>
					<TooltipContent position="bottom">Tooltip di bawah trigger.</TooltipContent>
				</Tooltip>
				<div></div>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Variants</h3>
			<div class="flex flex-wrap items-center gap-6">
				<Tooltip>
					<template #trigger>
						<Button>Default</Button>
					</template>
					<TooltipContent variant="default" position="top">Default variant</TooltipContent>
				</Tooltip>
				<Tooltip>
					<template #trigger>
						<Button variant="primary">Primary</Button>
					</template>
					<TooltipContent variant="primary" position="top">Primary variant</TooltipContent>
				</Tooltip>
				<Tooltip>
					<template #trigger>
						<Button variant="success">Success</Button>
					</template>
					<TooltipContent variant="success" position="top">Success variant</TooltipContent>
				</Tooltip>
				<Tooltip>
					<template #trigger>
						<Button variant="warning">Warning</Button>
					</template>
					<TooltipContent variant="warning" position="top">Warning variant</TooltipContent>
				</Tooltip>
				<Tooltip>
					<template #trigger>
						<Button variant="danger">Danger</Button>
					</template>
					<TooltipContent variant="danger" position="top">Danger variant</TooltipContent>
				</Tooltip>
				<Tooltip>
					<template #trigger>
						<Button variant="secondary">Black</Button>
					</template>
					<TooltipContent variant="black" position="top">Black variant</TooltipContent>
				</Tooltip>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Long Content</h3>
			<Tooltip>
				<template #trigger>
					<Button data-cy="tooltip-long" data-testid="tooltip-long">Hover for detail</Button>
				</template>
				<TooltipContent position="right" variant="primary" class="w-80">
					Tooltip dapat memuat konten panjang. Default max-width mengikuti
					konten, dan bisa diperlebar dengan utility class Tailwind (mis.
					<code>w-80</code>).
				</TooltipContent>
			</Tooltip>
		</section>
	</div>
</template>

<script setup lang="ts">
import Button from '@/components/button/Button.vue'
import { Tooltip, TooltipContent } from '@/components/tooltip'
</script>
