describe('Input prevent default', () => {
	it('Input field should trigger event prevent default if user input more than 1 dots', () => {
		cy.visit('http://localhost:5173')
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('1.2')
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
			'have.value',
			'1.2'
		)
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('.')
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
			'have.value',
			'1.2'
		)
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('2')
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
			'have.value',
			'1.22'
		)
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('.')
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
			'have.value',
			'1.22'
		)
	})

	it('Input field should trigger event prevent default if user input more than 2 digits after dots', () => {
		cy.visit('http://localhost:5173')
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('1.2')
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
			'have.value',
			'1.2'
		)
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('3')
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
			'have.value',
			'1.23'
		)
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('4')
		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
			'have.value',
			'1.23'
		)
	})
})

describe('Handle input copy paste on numeric typed', () => {
	it('[PASTE] Input field should trigger event prevent default if user input more than 1 dots', () => {
		cy.visit('http://localhost:5173')
		// wait for the page to load
		cy.wait(2000)
		let textToPaste = '1.2'
		const dataCy = '[data-cy="cypress-numeric-max-fraction-digits"]'
		checkHandleInputCopyPaste(dataCy, textToPaste, '1.2')
		// remove input value
		cy.get(dataCy).clear()

		textToPaste = '1.2.3'
		checkHandleInputCopyPaste(dataCy, textToPaste, '1.23')

		cy.get(dataCy).clear()

		textToPaste = '1.23.4'
		checkHandleInputCopyPaste(dataCy, textToPaste, '1.23')

		cy.get(dataCy).clear()

		textToPaste = '1.234.5'
		checkHandleInputCopyPaste(dataCy, textToPaste, '1.23')
	})
})

function checkHandleInputCopyPaste(
	dataCy: string,
	textToPaste: string,
	expectedValue: string
) {
	cy.get(dataCy)
		.focus()
		.then($el => {
			const pasteEvent = getClipboardData(textToPaste)

			$el[0].dispatchEvent(pasteEvent)
			$el[0].dispatchEvent(new Event('input', { bubbles: true }))
		})
	cy.get(dataCy).should('have.value', expectedValue)
}

function getClipboardData(textToPaste: string) {
	const pasteEvent = new ClipboardEvent('paste', {
		bubbles: true,
		cancelable: true,
		clipboardData: new DataTransfer(),
	})

	console.log('pasteEvent', pasteEvent, textToPaste)
	pasteEvent.clipboardData.setData('text/plain', textToPaste)
	return pasteEvent
}
