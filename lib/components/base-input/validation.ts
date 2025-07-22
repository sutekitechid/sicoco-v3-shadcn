// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validate(v$: any) {
	v$.value.modelValue.$touch()
	return !v$.value.modelValue.$invalid
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reset(v$: any) {
	v$.value.modelValue.$reset()
}
