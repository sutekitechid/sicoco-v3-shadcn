<script setup lang="ts">
/**
 * Sample input SFC for parser tests.
 */
interface Props {
  modelValue?: string
  placeholder?: string
  type?: 'text' | 'password'
  required?: boolean
  disabled?: boolean
}

const props = defineProps<Props>()

defineSlots<{
  prefix?: () => unknown
  suffix?: () => unknown
  errors?: (props: { validation: unknown }) => unknown
}>()
</script>
