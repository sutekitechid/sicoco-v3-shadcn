import { VNode } from 'vue'

// Symbol(v-fgt) is a vnode type which indicates that the vnode is created by v-for loop
export const isFragment = (vnode: VNode) => vnode.type === Symbol.for('v-fgt')

export interface FragmentVNode extends VNode {
	children: VNode[] | undefined
}

export function flattenVNodes(vnodes: VNode[]): VNode[] {
	const result: VNode[] = []
	vnodes.forEach((vnode: VNode) => {
		if (!isFragment(vnode)) {
			result.push(vnode)
			return
		}
		// Recursively process fragment children
		if (Array.isArray((vnode as FragmentVNode).children)) {
			result.push(
				...flattenVNodes((vnode as FragmentVNode).children as VNode[])
			)
		}
	})
	return result
}
