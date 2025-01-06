import { h } from 'vue'

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'nim',
    header: () => h('div', {}, 'NIM'),
    cell: ({ row }) => {
      return h('div', {}, row.getValue('nim'))
    },
  },
  // column related to name field
  {
    accessorKey: 'name',
    header: () => h('div', 'Name'),
    cell: ({ row }) => {
      return h('div', {}, row.getValue('name'))
    },
  },
  // column related to major field
  {
    accessorKey: 'major',
    header: () => h('div', 'Major'),
    cell: ({ row }) => {
      return h('div', {}, row.getValue('major'))
    },
  },
]