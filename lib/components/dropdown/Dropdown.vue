<script setup lang="ts">
import { useSlots, computed, ref } from 'vue'
import type {
	PopoverRootEmits,
	PopoverRootProps,
	PopoverTriggerProps,
} from 'radix-vue'
import { PopoverRoot, useForwardPropsEmits, PopoverTrigger } from 'radix-vue'
import DropdownTrigger from './DropdownTrigger.vue'
import DropdownContent from './DropdownContent.vue'

type CustomValidators = Record<string, unknown>

interface Props {
	modelValue?: string | number | boolean | object | any[]
	options?: any[]
	placeholder?: string
	optionLabel?: string
	customFormatter?: (option: any) => string
	customFilter?: (options: any[], search: string) => any[]
	disabled?: boolean
	required?: boolean
	customValidators?: CustomValidators
	searchable?: boolean
	backendSearch?: boolean
	loading?: boolean
	triggerClass?: string
	optionClass?: string
	multiple?: boolean
	closeOnSelect?: boolean
	appendToBody?: boolean
	mobileModal?: boolean
	inline?: boolean
	placement?: string
	closable?: boolean
	hasIcon?: boolean
	dataCy?: string
	isOptionDisabled?: (option: any) => boolean
}

const props = defineProps<Props>()

// Define the events emitted by this component. These events are passed to the PopoverRoot component.
interface EmitEvents {
	(
		event: 'update:modelValue',
		value: string | number | boolean | object | any[]
	): void
	(event: 'typing', value: string): void
	(event: 'select', selectedOption: any): void
	(event: 'active-change', isActive: boolean): void
	(event: 'focus', event: FocusEvent): void
}

const emits = defineEmits<EmitEvents>()

// Forward the props and emits to the PopoverRoot component
const forwarded = useForwardPropsEmits(props, emits)

const slots = useSlots()

const selectedOptionLabel = computed(() => {
	if (
		props.modelValue === undefined ||
		(Array.isArray(props.modelValue) && props.modelValue?.length < 1)
	) {
		return props.placeholder || 'Select options..'
	}
	if (props.modelValue) {
		return getLabel(props.modelValue)
	}
	return null
})

function getOptionLabel(option) {
	if (option) {
		return getLabel(option)
	}
	return undefined
}

function getLabel(value) {
	let _label = value
	if (props.customFormatter) {
		_label = props.customFormatter(value)
	} else if (typeof value === 'object' && props.optionLabel) {
		_label = value[props.optionLabel]
	}
	return _label
}

function selectOption(value) {
	if (props.multiple) {
		emit('update:modelValue', upsertArray(props.modelValue, value))
	} else {
		emit('update:modelValue', value)
	}
	emit('select', value)
}

const onClickOption = option => {
	// prevent select disabled option
	if (props.isOptionDisabled && props.isOptionDisabled(option)) {
		return
	}
	selectOption(option)
	// if (props.closeOnSelect) {
	//   closeDropdown()
	// }
}
</script>

<template>
	<!-- The PopoverRoot component is rendered with the forwarded props and emits. -->
	<!-- The content inside the Popover component is rendered as a slot. -->
	<PopoverRoot v-bind="forwarded">
		<DropdownTrigger>
			<slot name="trigger" />
			<div v-if="!slots.trigger">
				<button
					type="button"
					class="inline-flex items-center w-full h-[2.75rem] border-[1px] justify-between gap-x-1.5 rounded-md px-3 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-50 focus:ring-2 focus:ring-primary-30"
					:class="[
						{ 'text-grey-100 bg-white hover:bg-grey-10': !disabled },
						{ 'bg-grey-10 cursor-not-allowed': disabled },
						{
							'!border-danger-70 text-danger-80 focus:ring-danger-30':
								dirty && validation.$invalid,
						},
						{ '!text-grey-60': !modelValue },
					]"
					aria-expanded="true"
					aria-haspopup="true"
				>
					<p
						v-if="
							modelValue === undefined ||
							options?.length > 0 ||
							(customFormatter && modelValue)
						"
						class="block truncate my-auto"
					>
						{{ selectedOptionLabel }}
					</p>
					<div v-else-if="!selectedDropdownItem">
						<!-- prevent chevron arrow to the left -->
					</div>
					<component :is="selectedDropdownItem" v-else class="truncate block">
						<!-- Take label from SDropdownItem -->
					</component>
					<s-spinner v-if="loading" />
					<div v-else class="w-6 h-6">
						<i class="si-chevron-down" />
					</div>
					<!-- :class="[{ 'rotate-180': open && !disabled, 'rotate-0': !open }]" -->
				</button>
			</div>
		</DropdownTrigger>
		<DropdownContent>
			<slot />
			<template v-if="hasOptions">
				<a
					v-for="(option, index) in filteredOptions"
					:key="index"
					data-cy="dropdown-item"
					@click="onClickOption(option)"
				>
					<div
						:class="[
							{
								'bg-primary-100 text-white hover:bg-primary-100 dark:hover:text-grey-20 dark:bg-grey-70':
									isOptionSelected(option),
								'bg-grey-10 border-grey-40 text-grey-40 cursor-not-allowed':
									isOptionDisabled && isOptionDisabled(option),
								'cursor-pointer': !(
									isOptionDisabled && isOptionDisabled(option)
								),
							},
						]"
						class="block px-4 py-2 hover:bg-grey-10 dark:hover:bg-grey-70 dark:hover:text-white"
					>
						<slot name="option" :props="option" />
						<p v-if="!slots.option">
							{{ getOptionLabel(option) }}
						</p>
					</div>
				</a>
			</template>
		</DropdownContent>
	</PopoverRoot>
</template>
