import { cva, type VariantProps } from 'class-variance-authority'
import { isNumeric } from '../../utils/numeric'

export { default as Input } from './Input.vue'
export { default as InputErrorMessage } from './InputErrorMessage.vue'
export { default as InputPrefix } from './InputPrefix.vue'
export { default as InputSuffix } from './InputSuffix.vue'
export { default as InputMorpUnit } from './InputMorpUnit.vue'
export { default as InputPassword } from './InputPassword.vue'

export const inputVariants = cva(
  'box-border w-full rounded-md text-neutral-100 border border-neutral-30 bg-neutral-5 ring-offset-neutral-5 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-50/40 focus-visible:ring-offset-0 focus-visible:border-primary-100/60 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-11 px-4 py-3',
        sm: 'h-8 px-3 py-2 text-xs',
        md: 'h-11 px-4 py-3',
        lg: 'h-14 px-8 py-4 text-base'
      },
      disabled: {
        true: 'bg-neutral-5 text-neutral-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'default',
      disabled: false
    }
  }
)

export type InputVariants = VariantProps<typeof inputVariants>
export type InputType = 'text' | 'number' | 'currency' | 'password' | 'email' | 'url'
export const InputTypeEnum = {
  text: 'text',
  number: 'number',
  currency: 'currency',
  password: 'password',
  email: 'email',
  url: 'url'
}

/**
 * Handle the keypress event
 * @param e
 * @param type
 * @param emit
 * @param modelValue
 * @param decimal
 * @returns void
 * @example
 * <input @keypress="keypress($event, 'number', $emit, modelValue, false)" />
 * <input @keypress="keypress($event, 'currency', $emit, modelValue, true)" />
 */
export function keypress(e: KeyboardEvent, type: string, emit: Function, modelValue: string | number, decimal: boolean) {
  emit('keypress', e)
  if (e.key === 'Tab') {
    return
  }
  if ((type === InputTypeEnum.currency || type === InputTypeEnum.number) && !isNumeric(e.key)) {
    e.preventDefault()
  }
  if (type === 'currency') {
    // if the first value is 0 then prevent the user from typing another 0
    if (modelValue === 0) {
      e.preventDefault()
    }
  }

  if (type === 'number') {
    if (
      ['e', 'E', '+'].includes(e.key) ||
      (!decimal && [',', '.'].includes(e.key))
    ) {
      e.preventDefault()
    }
  }
}

/**
 * Parse the currency value to a number
 * @param value
 * @returns number
 * @example
 * parseCurrencyToNumber('1.000,00') // 1000
 **/
export const parseCurrencyToNumber = (value: string) => {
  const number = parseFloat(value.replaceAll('.', ''))
  return number
}

/**
 * Listen to the input event and update the model value
 * @param event
 * @param type
 * @param emit
 * @returns void
 * @example
 * <input @input="listenInput($event, 'number', $emit)" />
 * <input @input="listenInput($event, 'currency', $emit)" />
*/
export function listenInput(event: InputEvent, type: string, emit: Function) {
  const value = (event.target as HTMLInputElement)?.value
  if (type === 'number') {
    const number = Number(value)
    emit('update:modelValue', number)
    emit('input', number)
  } else if (type === InputTypeEnum.currency) {
    if (value === undefined || value === null || value === '') {
      emit('update:modelValue', undefined)
      emit('input', undefined)
      return
    }
    const number = parseCurrencyToNumber(value)
    emit('update:modelValue', number)
    emit('input', number)
  } else {
    emit('update:modelValue', value)
    emit('input', value)
  }
}

/**
 * Check if the value meets the exact length
 * @param value 
 * @param length 
 * @returns boolean
 */
export const meetsExactLength = (value: string | number, length: number) => {
  let mValue = value
  if (typeof value === 'number') {
    mValue = value.toString()
  }
  return value ? (typeof mValue === 'string' && mValue.length === length) : true
}

/**
 * Convert suffix/prefix width to css
 * @param width 
 * @returns 
 */
export const convertMorpWidthToCss = (width: number) => {
  if (width === 0) {
    return ''
  }
  return `calc(0.5rem + ${width}px)`
}

/**
 * Get the input padding right
 * @param suffixWidth 
 * @param dirty 
 * @param invalid 
 * @returns 
 */
export const getInputPaddingRight = (suffixWidth: number, dirty: boolean, invalid: boolean) => {
  if (suffixWidth === 0 && !dirty && !invalid) {
    return ''
  }
  const suffixWidthCss = convertMorpWidthToCss(suffixWidth)
  if (suffixWidth && (dirty && invalid)) {
    return `calc(${suffixWidthCss} + 1.5rem)`
  }
  return suffixWidthCss
}
