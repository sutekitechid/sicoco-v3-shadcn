describe('RichTextEditor v-model', () => {
	it('renders the initial value and returns editor changes to the parent', () => {
		const errors: string[] = []
		cy.on('uncaught:exception', error => {
			errors.push(error.message)
			return false
		})

		cy.visit('http://localhost:5173/#/rich-editor-e2e')
		cy.get('[data-cy="rich-editor-e2e"] .ql-editor')
			.should('contain.html', '<strong>content</strong>')
		cy.get('[data-cy="rich-editor-e2e"] .ql-editor')
			.click()
			.type('Hello')
			.should('contain.text', 'Hello')
		cy.get('[data-cy="rich-editor-e2e-value"]').should('contain.text', 'Hello')
		cy.then(() => {
			expect(errors).to.deep.equal([])
		})
	})
})
