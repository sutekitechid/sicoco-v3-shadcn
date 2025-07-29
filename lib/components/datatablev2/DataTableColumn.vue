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
      type: [Number, Function],
      default: 1
    },
    bodyRowspan: {
      type: [Number, Function],
      default: 1
    },
    footerColspan: {
      type: [Number, Function],
      default: 1
    },
    footerRowspan: {
      type: [Number, Function],
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
    width: {
      type: [Number, String],
      default: null
    },
    sortable: {
      type: Boolean,
      default: false
    },
  },
  emits: ['register'],
  setup(props) {
    const slots = useSlots()
    const register = inject('registerColumn')

    register({
      header: slots.header,
      cell: slots.default,
      footer: slots.footer,
      colspan: props.colspan,
      rowspan: props.rowspan,
      bodyColspan: props.bodyColspan,
      bodyRowspan: props.bodyRowspan,
      footerColspan: props.footerColspan,
      footerRowspan: props.footerRowspan,
      group: props.group,
      field: props.field,
      order: props.order || -1, // Default order is -1 if not specified
      width: props.width, // Add width to registration
      hasExplicitOrder: props.order !== null,
      sortable: props.sortable
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