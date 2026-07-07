<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">States: Default</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Accordion dalam kondisi aktif. Klik trigger untuk membuka atau
				menutup item.
			</p>
			<Accordion
				v-model="defaultValue"
				type="single"
				collapsible
				class="w-full"
				data-cy="accordion-default"
				data-testid="accordion-default"
			>
				<AccordionItem
					value="default-1"
					data-cy="accordion-default-item-1"
					data-testid="accordion-default-item-1"
				>
					<AccordionTrigger>
						<template #label>Apakah konten ini dapat diakses?</template>
					</AccordionTrigger>
					<AccordionContent>
						Ya. Accordion mengikuti pola desain WAI-ARIA sehingga dapat
						dinavigasi menggunakan keyboard dan pembaca layar.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem
					value="default-2"
					data-cy="accordion-default-item-2"
					data-testid="accordion-default-item-2"
				>
					<AccordionTrigger>
						<template #label>Apakah styling-nya dapat dikustomisasi?</template>
					</AccordionTrigger>
					<AccordionContent>
						Ya. Anda bebas mengatur tampilan dan nuansa accordion melalui
						prop `class` pada setiap komponen.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem
					value="default-3"
					data-cy="accordion-default-item-3"
					data-testid="accordion-default-item-3"
				>
					<AccordionTrigger>
						<template #label>Apakah dapat menggunakan animasi?</template>
					</AccordionTrigger>
					<AccordionContent>
						Ya. Anda dapat menggunakan prop `transition` untuk mengatur
						animasi buka dan tutup konten.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">States: Disabled</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Item dengan prop `disabled` tidak dapat dibuka atau ditutup. Item
				lain pada accordion yang sama tetap aktif.
			</p>
			<Accordion
				v-model="disabledValue"
				type="single"
				collapsible
				class="w-full"
				data-cy="accordion-disabled"
				data-testid="accordion-disabled"
			>
				<AccordionItem
					value="disabled-1"
					disabled
					data-cy="accordion-disabled-item-1"
					data-testid="accordion-disabled-item-1"
				>
					<AccordionTrigger>
						<template #label>Item pertama (disabled)</template>
					</AccordionTrigger>
					<AccordionContent>
						Konten ini tidak dapat ditampilkan karena item dalam keadaan
						disabled.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem
					value="disabled-2"
					data-cy="accordion-disabled-item-2"
					data-testid="accordion-disabled-item-2"
				>
					<AccordionTrigger>
						<template #label>Item kedua (aktif)</template>
					</AccordionTrigger>
					<AccordionContent>
						Item ini tetap dapat dibuka dan ditutup seperti biasa.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem
					value="disabled-3"
					disabled
					data-cy="accordion-disabled-item-3"
					data-testid="accordion-disabled-item-3"
				>
					<AccordionTrigger>
						<template #label>Item ketiga (disabled)</template>
					</AccordionTrigger>
					<AccordionContent>
						Konten ini tidak dapat ditampilkan karena item dalam keadaan
						disabled.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/accordion'

const defaultValue = ref<string | undefined>('default-1')
const disabledValue = ref<string | undefined>('disabled-2')
</script>
