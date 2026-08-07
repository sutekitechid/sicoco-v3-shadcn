<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="mb-3 text-lg font-semibold">Basic</h3>
			<div class="flex flex-col gap-3">
				<PinInput
					v-model="basicPin"
					placeholder="○"
					data-cy="pin-input-basic"
					data-testid="pin-input-basic"
				/>
				<p class="text-sm text-neutral-600">
					Live value:
					<span class="font-mono">{{ formatPin(basicPin) }}</span>
				</p>
			</div>
		</section>

		<section>
			<h3 class="mb-3 text-lg font-semibold">Custom Length</h3>
			<div class="flex flex-col gap-3">
				<PinInput
					v-model="sixDigitPin"
					:total-pins="6"
					type="number"
					placeholder="-"
					data-cy="pin-input-six-digits"
					data-testid="pin-input-six-digits"
				/>
				<p class="text-sm text-neutral-600">PIN numerik enam digit.</p>
			</div>
		</section>

		<section>
			<h3 class="mb-3 text-lg font-semibold">States</h3>
			<div class="flex flex-col gap-4">
				<div>
					<p class="mb-2 text-sm text-neutral-600">Pre-filled</p>
					<PinInput
						v-model="prefilledPin"
						:total-pins="4"
						type="number"
						data-cy="pin-input-prefilled"
						data-testid="pin-input-prefilled"
					/>
				</div>
				<div>
					<p class="mb-2 text-sm text-neutral-600">Disabled</p>
					<PinInput
						v-model="disabledPin"
						:total-pins="4"
						disabled
						data-cy="pin-input-disabled"
						data-testid="pin-input-disabled"
					/>
				</div>
			</div>
		</section>

		<section>
			<h3 class="mb-3 text-lg font-semibold">Completion</h3>
			<div class="flex flex-col gap-3">
				<PinInput
					v-model="completionPin"
					:total-pins="4"
					type="number"
					:handle-complete="handleComplete"
					data-cy="pin-input-completion"
					data-testid="pin-input-completion"
				/>
				<p
					v-if="completedPin"
					class="text-sm text-success-700"
					data-cy="pin-input-completion-result"
					data-testid="pin-input-completion-result"
				>
					Completed PIN: <span class="font-mono">{{ completedPin }}</span>
				</p>
			</div>
		</section>

		<section>
			<h3 class="mb-3 text-lg font-semibold">Validation</h3>
			<p class="mb-3 text-sm text-neutral-500">
				Klik Submit tanpa mengisi PIN untuk menampilkan state invalid.
			</p>
			<FormInput @submit="onValidSubmit">
				<PinInput
					v-model="requiredPin"
					:total-pins="4"
					type="number"
					required
					data-cy="pin-input-required"
					data-testid="pin-input-required"
				>
					<template #required>PIN wajib diisi.</template>
				</PinInput>
				<Button
					type="submit"
					data-cy="pin-input-submit"
					data-testid="pin-input-submit"
				>
					Submit
				</Button>
			</FormInput>
			<p
				v-if="submitResult"
				class="mt-2 text-sm text-success-700"
				data-cy="pin-input-submit-result"
				data-testid="pin-input-submit-result"
			>
				{{ submitResult }}
			</p>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/button/Button.vue'
import { FormInput } from '@/components/form-input'
import PinInput from '@/components/pin-input/PinInput.vue'

const basicPin = ref<string[]>([])
const sixDigitPin = ref<string[]>([])
const prefilledPin = ref(['1', '2', '3', '4'])
const disabledPin = ref(['A', 'B', 'C', 'D'])
const completionPin = ref<string[]>([])
const requiredPin = ref<string[]>([])
const completedPin = ref('')
const submitResult = ref('')

function formatPin(pin: string[]) {
	return pin.length ? pin.join('') : '(kosong)'
}

function handleComplete(pin: string[]) {
	completedPin.value = pin.join('')
}

function onValidSubmit(valid: boolean) {
	submitResult.value = valid
		? `Form valid! PIN: ${formatPin(requiredPin.value)}`
		: 'Form invalid, lengkapi PIN terlebih dahulu.'
}
</script>
