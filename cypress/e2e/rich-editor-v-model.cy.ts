type VueInstance = {
	type?: { __name?: string }
	vnode: { props: { modelValue?: unknown } }
	parent?: VueInstance
}

describe('RichTextEditor v-model', () => {
	it('renders the initial value and returns editor changes to the parent', () => {
		const errors: string[] = []
		cy.on('uncaught:exception', error => {
			errors.push(error.message)
			return false
		})

		cy.visit('/#/rich-editor')
		cy.get('[data-testid="rich-editor-readonly"] .ql-editor')
			.should('contain.html', '<strong>readonly</strong>')
		cy.get('[data-testid="rich-editor-default"] .ql-editor')
			.should('contain.text', 'asdsd')
			.click()
			.type('Hello')
			.should('contain.text', 'Hello')
		cy.get('[data-testid="rich-editor-default"]').then($element => {
			let instance = ($element[0] as { __vueParentComponent?: VueInstance })
				.__vueParentComponent

			while (instance?.type?.__name !== 'RichTextEditor') {
				instance = instance?.parent
			}

			expect(instance?.vnode.props.modelValue).to.contain('Hello')
		})
		cy.then(() => {
			expect(errors).to.deep.equal([])
		})
	})
})
