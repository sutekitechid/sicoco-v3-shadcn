<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { AccordionContent, type AccordionContentProps } from 'radix-vue'
import { computed, inject, provide, type HTMLAttributes } from 'vue'

/**
 * AccordionContent is a wrapper component for the content inside an accordion item.
 * It supports animations and transitions for open/close states.
 *
 * @example
 * <AccordionContent class="custom-class">
 *   <p>This is the content of the accordion.</p>
 * </AccordionContent>
 *
 * @props {string} [class] - Additional custom CSS classes for styling the content.
 */
const props = defineProps<
	AccordionContentProps & { class?: HTMLAttributes['class'] }
>()

/**
 * Computed properties to separate forwarded props from custom props.
 * This ensures that the `class` property is handled separately.
 * @returns {object} Delegated props excluding `class`.
 */
const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props
	return delegated
})

const accordion = inject('accordion', undefined)
const accordionItem = inject('accordionItem', undefined)

const isHidden = computed(() => {
	if (accordion.destroyOnHide) {
		return false
	}
	if (accordion.modelValue?.value === undefined) {
		return true
	}
	if (accordion.type === 'single') {
		return accordion.modelValue.value !== accordionItem.value.value
	}
	return accordion.modelValue.value.indexOf(accordionItem.value.value) === -1
})

const registerFormInputValidateFunc = inject('registerValidateFunc', undefined)

const openAccordion = () => {
	const accordionItemValue = accordionItem?.value.value
	if (accordion.type === 'single') {
		accordion.modelValue.value = accordionItemValue
	} else {
		const accordionModelValue = accordion.modelValue?.value || []
		const index = accordionModelValue.indexOf(accordionItemValue)
		if (index === -1) {
			accordion.modelValue.value.push(accordionItemValue)
		}
	}
	return
}

const registerValidateFunc = params => {
	if (registerFormInputValidateFunc) {
		params.openAccordion = openAccordion
		registerFormInputValidateFunc(params)
	}
}

provide('registerValidateFunc', registerValidateFunc)
</script>

<template>
	<AccordionContent
		v-bind="delegatedProps"
		:class="[
			cn(
				'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
				props.class
			),
			{ 'h-0': isHidden, 'h-max': !isHidden },
		]"
		:force-mount="!accordion.destroyOnHide"
	>
		<div :class="cn('pb-4 pt-0', props.class)">
			<slot />
		</div>
	</AccordionContent>
</template>
