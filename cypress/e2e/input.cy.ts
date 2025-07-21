/// <reference types="cypress" />

beforeEach(() => {
	cy.visit('http://localhost:5173/input')
})

// describe('Input prevent default', () => {
// 	it('Input field should trigger event prevent default if user input more than 1 dots', () => {
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('1.2')
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
// 			'have.value',
// 			'1.2'
// 		)
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('.')
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
// 			'have.value',
// 			'1.2'
// 		)
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('2')
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
// 			'have.value',
// 			'1.22'
// 		)
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('.')
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
// 			'have.value',
// 			'1.22'
// 		)
// 	})

// 	it('Input field should trigger event prevent default if user input more than 2 digits after dots', () => {
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('1.2')
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
// 			'have.value',
// 			'1.2'
// 		)
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('3')
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
// 			'have.value',
// 			'1.23'
// 		)
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').type('4')
// 		cy.get('[data-cy="cypress-numeric-max-fraction-digits"]').should(
// 			'have.value',
// 			'1.23'
// 		)
// 	})
// })

// describe('Input number with max value', () => {
// 	const dataCy = '[data-cy="cypress-numeric-max-value"]'
// 	it('Input field should return correct value', () => {
// 		cy.get(dataCy).type('100')
// 		cy.get(dataCy).should('have.value', '100')
// 	})
// 	it('Input field should trigger event prevent default if user input more than max value (added 1 char behind)', () => {
// 		cy.get(dataCy).type('100')
// 		cy.get(dataCy).should('have.value', '100')
// 		cy.get(dataCy).type('1')
// 		cy.get(dataCy).should('have.value', '100')
// 	})
// })

// describe('Input text with max length', () => {
// 	const dataCy = '[data-cy="cypress-text-max-length"]'
// 	it('Input field should return correct value (numeric input)', () => {
// 		cy.get(dataCy).type('1234567890')
// 		cy.get(dataCy).should('have.value', '1234567890')
// 	})
// 	it('Input field should return correct value (text input)', () => {
// 		cy.get(dataCy).type('12345678as')
// 		cy.get(dataCy).should('have.value', '12345678as')
// 	})
// 	it('Input field should trigger event prevent default if user input more than max length (added 1 char behind)', () => {
// 		cy.get(dataCy).type('12345678as')
// 		cy.get(dataCy).should('have.value', '12345678as')
// 		cy.get(dataCy).type('1')
// 		cy.get(dataCy).should('have.value', '12345678as')
// 	})
// })

// describe('Handle input copy paste on text typed', () => {
// 	it('[PASTE] Input field should have correct value after paste', () => {
// 		const textToPaste = '1234567890'
// 		const dataCy = '[data-cy="cypress-text-max-length"]'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '1234567890')
// 		cy.get(dataCy).clear()
// 		const textToPaste2 = '12345678as'
// 		checkHandleInputCopyPaste(dataCy, textToPaste2, '12345678as')
// 		cy.get(dataCy).clear()
// 		const textToPaste3 = '12345678as1'
// 		checkHandleInputCopyPaste(dataCy, textToPaste3, '12345678as')
// 		cy.get(dataCy).clear()
// 	})
// })

describe('Handle input copy paste on number typed', () => {
	it('[PASTE] Input field should trigger event prevent default if user input more than 1 dots', () => {
		let textToPaste = '1.2'
		const dataCy = '[data-cy="cypress-numeric-max-fraction-digits"]'
		checkHandleInputCopyPaste(dataCy, textToPaste, '1.2')
		cy.get(dataCy).clear()

		textToPaste = '1.2.'
		checkHandleInputCopyPaste(dataCy, textToPaste, '1.2')
		cy.get(dataCy).clear()

		textToPaste = '1..2'
		checkHandleInputCopyPaste(dataCy, textToPaste, '1.2')
		cy.get(dataCy).clear()

		textToPaste = '1.22'
		checkHandleInputCopyPaste(dataCy, textToPaste, '1.22')
		cy.get(dataCy).clear()

		textToPaste = '1.2.2'
		checkHandleInputCopyPaste(dataCy, textToPaste, '1.22')
		cy.get(dataCy).clear()
	})

	it('[PASTE] Input field should trigger event prevent default if user input more than 100', () => {
		let textToPaste = '100'
		const dataCy = '[data-cy="cypress-numeric-max-value"]'
		checkHandleInputCopyPaste(dataCy, textToPaste, '100')
		cy.get(dataCy).clear()

		textToPaste = '1001'
		checkHandleInputCopyPaste(dataCy, textToPaste, '100')

		cy.get(dataCy).clear()

		textToPaste = '100.1'
		checkHandleInputCopyPaste(dataCy, textToPaste, '100')

		cy.get(dataCy).clear()

		textToPaste = '101.1'
		checkHandleInputCopyPaste(dataCy, textToPaste, '100')
	})
})

// describe('Handle input type currency', () => {
// 	it('Input field should return correct value', () => {
// 		const dataCy = '[data-cy="cypress-currency"]'
// 		cy.get(dataCy).type('1000')
// 		cy.get(dataCy).should('have.value', '1.000')
// 		cy.get(dataCy).type('1')
// 		cy.get(dataCy).should('have.value', '10.001')
// 		cy.get(dataCy).type('2')
// 		cy.get(dataCy).should('have.value', '100.012')
// 		cy.get(dataCy).type('3')
// 		cy.get(dataCy).should('have.value', '1.000.000')
// 	})
// 	it('Input field should return correct value if user input non number value', () => {
// 		const dataCy = '[data-cy="cypress-currency"]'
// 		cy.get(dataCy).type('1000')
// 		cy.get(dataCy).should('have.value', '1.000')
// 		cy.get(dataCy).type('a')
// 		cy.get(dataCy).should('have.value', '1.000')
// 		cy.get(dataCy).type('!')
// 		cy.get(dataCy).should('have.value', '1.000')
// 	})
// 	it('Input field should return correct value if user input exceed max value', () => {
// 		const dataCy = '[data-cy="cypress-currency"]'
// 		cy.get(dataCy).type('1000')
// 		cy.get(dataCy).should('have.value', '1.000')
// 		cy.get(dataCy).type('1')
// 		cy.get(dataCy).should('have.value', '10.001')
// 		cy.get(dataCy).type('2')
// 		cy.get(dataCy).should('have.value', '100.012')
// 		cy.get(dataCy).type('3')
// 		cy.get(dataCy).should('have.value', '1.000.000')
// 	})
// })

// describe('Handle input type currency copy paste', () => {
// 	it('[PASTE] Input field should have correct value after paste', () => {
// 		const textToPaste = '1000'
// 		const dataCy = '[data-cy="cypress-currency"]'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '1.000')
// 		cy.get(dataCy).clear()
// 		const textToPaste2 = '10001'
// 		checkHandleInputCopyPaste(dataCy, textToPaste2, '10.001')
// 		cy.get(dataCy).clear()
// 		const textToPaste3 = '100012'
// 		checkHandleInputCopyPaste(dataCy, textToPaste3, '100.012')
// 		cy.get(dataCy).clear()
// 	})

// 	it('[PASTE] Input field should trigger event prevent default if user input more than 1000000', () => {
// 		let textToPaste = '100'
// 		const dataCy = '[data-cy="cypress-currency"]'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '100')
// 		cy.get(dataCy).clear()
// 		textToPaste = '1000000'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '1.000.000')
// 		cy.get(dataCy).clear()
// 		textToPaste = '1000001'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '')
// 		cy.get(dataCy).clear()
// 	})

// 	it('[PASTE] Input field should trigger event prevent default if user input non number value', () => {
// 		const dataCy = '[data-cy="cypress-currency"]'
// 		cy.get(dataCy).type('1000')
// 		cy.get(dataCy).should('have.value', '1.000')
// 		cy.get(dataCy).clear()
// 		const textToPaste = 'a'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '')
// 		cy.get(dataCy).clear()
// 		const textToPaste2 = '!'
// 		checkHandleInputCopyPaste(dataCy, textToPaste2, '')
// 	})
// })

// describe('Handle input type numeric', () => {
// 	it('Input field should return correct value', () => {
// 		const dataCy = '[data-cy="cypress-numeric"]'
// 		cy.get(dataCy).type('1000')
// 		cy.get(dataCy).should('have.value', '1000')
// 		cy.get(dataCy).type('1')
// 		cy.get(dataCy).should('have.value', '10001')
// 		cy.get(dataCy).type('a')
// 		cy.get(dataCy).should('have.value', '10001')
// 	})
// 	it('Input field should return correct value if user input more than 10 digits', () => {
// 		const dataCy = '[data-cy="cypress-numeric"]'
// 		cy.get(dataCy).type('1234567890')
// 		cy.get(dataCy).should('have.value', '1234567890')
// 		cy.get(dataCy).type('1')
// 		cy.get(dataCy).should('have.value', '1234567890')
// 	})
// })

// describe('Handle input type numeric copy paste', () => {
// 	it('[PASTE] Input field should have correct value after paste', () => {
// 		const textToPaste = '1000'
// 		const dataCy = '[data-cy="cypress-numeric"]'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '1000')
// 		cy.get(dataCy).clear()
// 		const textToPaste2 = '10001'
// 		checkHandleInputCopyPaste(dataCy, textToPaste2, '10001')
// 		cy.get(dataCy).clear()
// 		const textToPaste3 = '100012a'
// 		checkHandleInputCopyPaste(dataCy, textToPaste3, '100012')
// 		cy.get(dataCy).clear()
// 	})
// 	it('[PASTE] Input field should trigger event prevent default if user input more than 10 digits', () => {
// 		let textToPaste = '100'
// 		const dataCy = '[data-cy="cypress-numeric"]'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '100')
// 		cy.get(dataCy).clear()
// 		textToPaste = '12345678901'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '1234567890')
// 		cy.get(dataCy).clear()
// 		textToPaste = '123456789012'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '1234567890')
// 		cy.get(dataCy).clear()
// 	})
// })

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

	pasteEvent.clipboardData.setData('text/plain', textToPaste)
	return pasteEvent
}
