import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

export interface Payment {
	id: string
	amount: number
	status: 'pending' | 'processing' | 'success' | 'failed'
	email: string
	date: string
	channel: string
}

export const payments: Payment[] = [
	{
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
		date: '2021-06-01',
		channel: 'PayPal',
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com',
		date: '2021-06-02',
		channel: 'Stripe',
	},
	// ...
]

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: 'id',
		header: () => h('div', 'ID'),
		// cell: ({ row }) => h('div', row.getValue('id')),
		cell: ({ row }) => row.getValue('id'),
	},
	{
		accessorKey: 'email',
		header: () => h('div', 'Email'),
		cell: ({ row }) => h('div', row.getValue('email')),
	},
	{
		accessorKey: 'status',
		header: () => h('div', 'Status'),
		cell: ({ row }) => h('div', row.getValue('status')),
	},
	{
		accessorKey: 'amount',
		header: () => h('div', { class: 'text-right' }, 'Amount'),
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue('amount'))
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount)

			return h('div', { class: 'text-right font-medium' }, formatted)
		},
	}
]
