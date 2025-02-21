import { VNode } from 'vue'

export const isFragment = (vnode: VNode) => vnode.type === Symbol.for('v-fgt')
