import { VNode } from 'vue'

// Symbol(v-fgt) is a vnode type which indicates that the vnode is created by v-for loop
export const isFragment = (vnode: VNode) => vnode.type === Symbol.for('v-fgt')
