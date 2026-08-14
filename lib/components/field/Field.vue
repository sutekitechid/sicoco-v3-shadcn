<template>
  <div :class="$props.class">
    <slot name="label" />
    <slot name="description" />
    <label
      v-if="!$slots.label"
      :for="$props.for"
      class="block text-label-lg font-semibold text-main"
    >
      {{ label }} <span
        v-if="required"
        class="text-danger-default"
      >*</span>
    </label>
    <span
      v-if="description && !$slots.description"
      class="block text-label-md font-normal text-neutral-700 mt-1"
    >
      {{ description }}
    </span>
	<div class="mt-2">
		<slot />
	</div>
  </div>
</template>

<script lang="ts">
/**
 * Component slots
 * @slot label - The label slot
 * @slot - The default slot
 */

export default {
	name: 'Field',
	props: {
		/**
		 * The custom class of the field
		 */
		class: {
			type: String,
			default: '',
		},
		/**
		 * The id of the input this field is associated with
		 */
		for: {
			type: String,
			default: undefined,
		},
		/**
		 * The label of the field
		 */
		label: {
			type: String,
			default: ' ',
		},
		/**
		 * The description of the field
		 */
		description: {
			type: String,
			default: '',
		},
		/**
		 * The required state of the field
		 */
		required: {
			type: Boolean,
			default: false,
		},
	},
}
</script>
