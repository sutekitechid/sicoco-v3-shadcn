export function formatCurrency(value: string | number | null | undefined): string {
  if (value !== null && value !== undefined && value !== '') {
    value = value.toString()
    value = value.replace(/\./g, '')
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }
  return ''
}
