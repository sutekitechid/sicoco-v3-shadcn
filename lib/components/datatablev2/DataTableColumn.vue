<script>
import { inject, useSlots } from 'vue'

export default {
  name: 'DatatableColumn',
  props: {
    colspan: {
      type: Number,
      default: 1
    },
    rowspan: {
      type: Number,
      default: 1
    },
    bodyColspan: {
      type: Number,
      default: 1
    },
    bodyRowspan: {
      type: Number,
      default: 1
    },
    group: {
      type: String,
      default: ''
    },
    field: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: null
    },
  },
  emits: ['register'],
  setup(props) {
    const slots = useSlots()
    const register = inject('registerColumn')

    register({
      header: slots.header,
      cell: slots.default,
      colspan: props.colspan,
      rowspan: props.rowspan,
      bodyColspan: props.bodyColspan,
      bodyRowspan: props.bodyRowspan,
      group: props.group,
      field: props.field,
      order: props.order || -1, // Default order is -1 if not specified
      hasExplicitOrder: props.order !== null,
    })

    return {
      slots,
      register
    }
  }
}
</script>

<template>
</template>