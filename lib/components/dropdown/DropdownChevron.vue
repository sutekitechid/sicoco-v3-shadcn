<template>
	<component :is="as" :class="getClass" :data-cy="dataCy">
		<i :class="iconClass" />
	</component>
</template>

<script lang="ts">
import { computed, PropType, HtmlHTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

/**
 * DropdownChevron component
 * This component renders a chevron icon that rotates based on the open state of the dropdown.
 * It can be used to indicate the open/close state of a dropdown menu.
 *
 * @component
 * @example
 * <DropdownChevron :open="isOpen" />
 */

export default {
	name: 'DropdownChevron',
	props: {
		/**
		 * The open state of the dropdown.
		 * This is required to control the rotation of the chevron icon.
		 * @type {boolean}
		 * @required
		 * @default true
		 */
		open: {
			type: Boolean,
			required: true,
		},
		/**
		 * The HTML element to render the chevron as.
		 * Defaults to 'div'.
		 * @type {string}
		 * @default 'div'
		 */
		as: {
			type: String,
			default: 'div',
		},
		/**
		 * Additional classes to apply to the chevron.
		 * Can be a string, an array of strings, or an object with class names as keys.
		 * @type {string | string[] | object}
		 * @default ''
		 */
		class: {
			type: [String, Object, Array] as PropType<
				string | HtmlHTMLAttributes | string[]
			>,
			default: '',
		},
		/**
		 * Duration of the rotation animation in milliseconds.
		 * @type {number}
		 * @default 200
		 */
		duration: {
			type: Number,
			default: 200,
		},
		/**
		 * The icon to display for the chevron.
		 * @type {string}
		 * @default 'si-chevron-down'
		 */
		icon: {
			type: String,
			default: '',
		},
		/**
		 * Data attribute for testing purposes.
		 */
		dataCy: {
			type: String,
			default: '',
		},
	},
	setup(props) {
		const isOpen = computed(() => props.open)
		const duration = computed(() => props.duration)

		const durationClasses = {
			100: 'duration-100',
			150: 'duration-150',
			200: 'duration-200',
			300: 'duration-300',
			500: 'duration-500',
			700: 'duration-700',
			1000: 'duration-1000',
		}

		const getClass = computed(() => {
			const baseClasses = [
				'w-6 h-6 flex items-center justify-center transition-transform',
				durationClasses[duration.value] || 'duration-200',
				isOpen.value ? 'rotate-180' : 'rotate-0',
			]

			return cn(baseClasses, props.class)
		})

		const iconClass = computed(() => {
			return props.icon || 'si-chevron-down text-neutral-100'
		})

		const dataCy = computed(() => {
			if (isOpen.value) {
				return props.dataCy ? `${props.dataCy}-open` : 'dropdown-chevron-open'
			}
			return props.dataCy ? `${props.dataCy}-closed` : 'dropdown-chevron-closed'
		})

		return {
			isOpen,
			getClass,
			iconClass,
			dataCy,
			as: computed(() => props.as),
		}
	},
}
</script>
