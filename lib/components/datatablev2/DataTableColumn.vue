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
    pin: {
      type: String, // PIN_DIRECTION.Left, PIN_DIRECTION.Right, or empty string
      default: '',
    },
    defaultSort: {
      type: String, // SORT_DIRECTION.Asc or SORT_DIRECTION.Desc
      default: ''
    }
  },
  emits: ['register'],
  setup(props) {
    const slots = useSlots()
    const register = inject('registerColumn')

    // Dynamically collect all footer slots
    const footerSlots = {}
    Object.keys(slots).forEach(slotName => {
      if (slotName.startsWith('footer')) {
        footerSlots[slotName] = slots[slotName]
      }
    })

    register({
      header: slots.header,
      cell: slots.default,
      footer: slots.footer, // Keep backward compatibility
      footerSlots, // Dynamic footer slots collection
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
      sortable: props.sortable,
      pin: props.pin, // Add pin prop to registration
      defaultSort: props.defaultSort
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