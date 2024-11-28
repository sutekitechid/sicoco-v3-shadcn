<template>
  <form
    ref="formInput"
    class="[&>:not(:last-child)]:mb-4 mb-2"
    :autocomplete="autocomplete"
    novalidate
    @submit.prevent="validateForm"
  >
    <slot />
  </form>
</template>

<script setup>
import { defineExpose, ref } from 'vue'
import { registerValidateFunc, removeValidateFunc, validate } from '.'

defineProps({
  label: {
    type: String,
    default: undefined,
  },
  autocomplete: {
    type: String,
    default: 'off'
  }
})

// register validate function from each child component
// which is an input component such as InputText, InputSelect, dropdown, etc
const slotValidateFuncList = ref([])

// validate all input component
// if there is an invalid input, scroll to that input
// if all input is valid, emit submit event
const emit = defineEmits(['submit'])

/**
 * Reset all input component
 */
function reset() {
  slotValidateFuncList.value.forEach(item => {
    item.reset()
  })
}

const registerInputValidateFunction = (func) => {
  registerValidateFunc(func, slotValidateFuncList)
}

const removeInputValidateFunction = (id) => {
  removeValidateFunc(id, slotValidateFuncList)
}

const validateForm = () => {
  validate(slotValidateFuncList, emit)
}

defineExpose({
  registerValidateFunc: registerInputValidateFunction,
  removeValidateFunc: removeInputValidateFunction,
  validate: validateForm,
  reset,
})
</script>
