export function validate(v$: any) {
	v$.value.modelValue.$touch()
	return !v$.value.modelValue.$invalid
}
export function reset(v$: any) {
	v$.value.modelValue.$reset()
}
