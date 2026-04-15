import { test, expect } from 'vitest'
import { isFragment, flattenVNodes } from '../lib/utils/vnode'
import type { VNode } from 'vue'

function makeVNode(type: unknown): VNode {
	return { type } as VNode
}

function makeFragment(children: VNode[]): VNode {
	return { type: Symbol.for('v-fgt'), children } as unknown as VNode
}

test('isFragment returns true for a fragment vnode', () => {
	const vnode = makeFragment([])
	expect(isFragment(vnode)).toBe(true)
})

test('isFragment returns false for a regular element vnode', () => {
	const vnode = makeVNode('div')
	expect(isFragment(vnode)).toBe(false)
})

test('isFragment returns false for a component vnode', () => {
	const vnode = makeVNode({ template: '<div />' })
	expect(isFragment(vnode)).toBe(false)
})

test('flattenVNodes returns non-fragment vnodes as-is', () => {
	const vnodes = [makeVNode('div'), makeVNode('span')]
	const result = flattenVNodes(vnodes)
	expect(result).toHaveLength(2)
	expect(result[0].type).toBe('div')
	expect(result[1].type).toBe('span')
})

test('flattenVNodes flattens a single-level fragment', () => {
	const child1 = makeVNode('p')
	const child2 = makeVNode('a')
	const fragment = makeFragment([child1, child2])

	const result = flattenVNodes([fragment])
	expect(result).toHaveLength(2)
	expect(result[0].type).toBe('p')
	expect(result[1].type).toBe('a')
})

test('flattenVNodes handles nested fragments recursively', () => {
	const innerChild = makeVNode('span')
	const innerFragment = makeFragment([innerChild])
	const outerFragment = makeFragment([innerFragment])

	const result = flattenVNodes([outerFragment])
	expect(result).toHaveLength(1)
	expect(result[0].type).toBe('span')
})

test('flattenVNodes handles a mix of fragments and regular nodes', () => {
	const regular = makeVNode('div')
	const fragChild = makeVNode('em')
	const fragment = makeFragment([fragChild])

	const result = flattenVNodes([regular, fragment])
	expect(result).toHaveLength(2)
	expect(result[0].type).toBe('div')
	expect(result[1].type).toBe('em')
})

test('flattenVNodes returns empty array for empty input', () => {
	expect(flattenVNodes([])).toEqual([])
})

test('flattenVNodes handles fragment with no children gracefully', () => {
	const fragment = { type: Symbol.for('v-fgt'), children: undefined } as unknown as VNode
	const result = flattenVNodes([fragment])
	expect(result).toHaveLength(0)
})
