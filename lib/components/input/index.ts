import { cva, type VariantProps } from 'class-variance-authority'
import { isNumeric } from '../../utils/numeric'

export { default as Input } from './Input.vue'

export const inputVariants = cva(
  'box-border w-full rounded-md text-grey-100 border border-slate-200 bg-white ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-50/40 focus-visible:ring-offset-0 focus-visible:border-primary-100/60 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
  {
    variants: {
      size: {
        default: 'h-11 px-4 py-3',
        sm: 'px-3 py-2 text-xs',
        md: 'h-11 px-4 py-3',
        lg: 'px-8 py-4 text-base'
      },
      disabled: {
        true: 'bg-grey-10 text-grey-50 cursor-not-allowed',
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

const parseCurrencyToNumber = (value: string) => {
  const number = parseFloat(value.replaceAll('.', ''))
  return number
}

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