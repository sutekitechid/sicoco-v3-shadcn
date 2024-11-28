export function findFormInput(parent: any) {
  if (parent.exposed && parent.exposed.registerValidateFunc) {
    return parent
  }
  // apakah harus traverse sampai root?
  if (parent.parent) {
    return findFormInput(parent.parent)
  }
  return null
}

export const registerValidateFunc = (useValidation: Boolean, formInput: any, elementDataId: string, focusFunction: Function, validate: Function, reset: Function) => {
  if (!useValidation) {
    return
  }
  if (formInput && formInput.exposed.registerValidateFunc) {
    formInput.exposed.registerValidateFunc({ validate, reset, id: elementDataId, focusFunction })
  }
}

export function validate(v$: any) {
  v$.value.modelValue.$touch()
  return !v$.value.modelValue.$invalid
}
export function reset(v$: any) {
  v$.value.modelValue.$reset()
}