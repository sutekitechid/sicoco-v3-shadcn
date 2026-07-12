<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">States</h3>
			<div class="flex flex-col gap-3">
				<Switch
					v-model="defaultSwitch"
					data-cy="switch-default"
					data-testid="switch-default"
				>
					Default (off)
				</Switch>
				<Switch
					v-model="selectedSwitch"
					data-cy="switch-selected"
					data-testid="switch-selected"
				>
					Selected (on)
				</Switch>
				<Switch
					:model-value="true"
					disabled
					data-cy="switch-disabled-on"
					data-testid="switch-disabled-on"
				>
					Disabled (on)
				</Switch>
				<Switch
					:model-value="false"
					disabled
					data-cy="switch-disabled-off"
					data-testid="switch-disabled-off"
				>
					Disabled (off)
				</Switch>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Variants</h3>
			<div class="flex flex-col gap-3">
				<Switch v-model="variantSwitches.primary" variant="primary">Primary</Switch>
				<Switch v-model="variantSwitches.success" variant="success">Success</Switch>
				<Switch v-model="variantSwitches.warning" variant="warning">Warning</Switch>
				<Switch v-model="variantSwitches.danger" variant="danger">Danger</Switch>
				<Switch v-model="variantSwitches.secondary" variant="secondary">Secondary</Switch>
				<Switch v-model="variantSwitches.grey" variant="grey">Grey</Switch>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">String Values (true-value/false-value)</h3>
			<div class="flex flex-col gap-3">
				<Switch
					v-model="themeMode"
					true-value="dark"
					false-value="light"
					variant="grey"
					data-cy="switch-string"
					data-testid="switch-string"
				>
					Mode: {{ themeMode }}
				</Switch>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Invalid (with SFormInput)</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Klik Submit tanpa mengaktifkan switch untuk memunculkan state invalid.
			</p>
			<FormInput @submit="onValidSubmit">
				<Switch
					v-model="invalidSwitch"
					required
					variant="primary"
					data-cy="switch-invalid"
					data-testid="switch-invalid"
				>
					Saya menyetujui syarat dan ketentuan
					<template #required>
						Anda harus menyetujui syarat dan ketentuan
					</template>
				</Switch>
				<Button type="submit" data-cy="switch-submit" data-testid="switch-submit">
					Submit
				</Button>
			</FormInput>
			<p
				v-if="lastSubmitResult"
				class="text-sm text-success-700 mt-2"
				data-cy="switch-submit-result"
				data-testid="switch-submit-result"
			>
				{{ lastSubmitResult }}
			</p>
		</section>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import Button from '@/components/button/Button.vue'
import Switch from '@/components/switch/Switch.vue'
import { FormInput } from '@/components/form-input'

const defaultSwitch = ref(false)
const selectedSwitch = ref(true)
const themeMode = ref('light')
const invalidSwitch = ref(false)
const lastSubmitResult = ref('')

const variantSwitches = reactive({
	primary: true,
	success: true,
	warning: true,
	danger: true,
	secondary: true,
	grey: true,
})

function onValidSubmit(valid: boolean) {
	lastSubmitResult.value = valid
		? `Form valid! Switch: ${invalidSwitch.value}`
		: 'Form invalid, aktifkan switch terlebih dahulu'
}
</script>
