import { h } from 'vue'

export default {
	name: 'SlotComponent',
	props: {
		component: {
			type: Object,
			required: true,
		},
		name: {
			type: String,
			default: 'default',
		},
		scoped: {
			type: Boolean,
		},
		props: {
			type: Object,
		},
		tag: {
			type: String,
			default: 'div',
		},
		event: {
			type: String,
			default: 'hook:updated',
		},
		sortable: {
			type: Boolean,
			default: false,
		},
	},
	render() {
		return h(
			this.tag,
			{},
			this.scoped
				? this.component.children?.[this.name]?.(this.props)
				: this.component.children?.[this.name]?.()
		)
	},
}
