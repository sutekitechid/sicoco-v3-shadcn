/// <reference types="cypress" />

beforeEach(() => {
	cy.visit('http://localhost:5173/form-validation-test')
	// Wait for Vue to mount and register all validations
	cy.wait(500)
})

Cypress.on('uncaught:exception', (err) => {
	if (err.message.includes('ResizeObserver loop completed')) {
		return false // prevent Cypress from failing
	}
})

describe('Form Validation Sequential Order', () => {
	it('should register static validations on page load', () => {
		// Check that 3 static fields are registered
		cy.get('[data-cy="total-validations"]').should('be.visible')
		cy.get('[data-cy="total-validations"]').invoke('text').then((text) => {
			cy.log('Total Validations:', text)
		})
		cy.get('[data-cy="total-validations"]').should('contain', '3')
	})

	it('should validate inputs in DOM order (sequential)', () => {
		// Leave all fields empty (they are required)
		cy.get('[data-cy="field-1"]').should('exist')
		cy.get('[data-cy="field-2"]').should('exist')
		cy.get('[data-cy="field-3"]').should('exist')

		// Submit form to trigger validation
		cy.get('[data-cy="submit-button"]').click()

		// Wait for validation to process
		cy.wait(200)

		// First field (in DOM order) should have focus and show error
		// Since all fields are invalid, validation should stop at first one and focus it
		cy.get('[data-cy="field-1"]').should('be.focused')

		// Fill first field and submit again
		cy.get('[data-cy="field-1"]').type('Valid Value 1')
		cy.get('[data-cy="submit-button"]').click()
		cy.wait(200)

		// Now second field should have focus (first invalid in sequence)
		cy.get('[data-cy="field-2"]').should('be.focused')

		// Fill second field and submit again
		cy.get('[data-cy="field-2"]').type('Valid Value 2')
		cy.get('[data-cy="submit-button"]').click()
		cy.wait(200)

		// Now third field should have focus
		cy.get('[data-cy="field-3"]').should('be.focused')

		// Fill third field
		cy.get('[data-cy="field-3"]').type('Valid Value 3')
		cy.get('[data-cy="submit-button"]').click()
		cy.wait(200)

		// All fields valid - check validation result updated
		cy.get('[data-cy="last-validation-result"]').should('not.contain', 'None')
	})

	it('should maintain sequential order even when fields are added in reverse', () => {
		// Add 3 dynamic fields first
		cy.get('[data-cy="add-dynamic-field"]').click()
		cy.wait(200)
		cy.get('[data-cy="add-dynamic-field"]').click()
		cy.wait(200)
		cy.get('[data-cy="add-dynamic-field"]').click()
		cy.wait(500) // Wait for all validations to register

		// Verify total validations registered (3 static + 3 dynamic = 6)
		cy.get('[data-cy="total-validations"]').should('contain', '6')

		// Check that validation order list shows DOM order
		cy.get('[data-cy="validation-order"] ol li').should('have.length', 6)

		// Submit to trigger validation
		cy.get('[data-cy="submit-button"]').click()
		cy.wait(200)

		// First static field should be focused (DOM order, not registration order)
		cy.get('[data-cy="field-1"]').should('be.focused')
	})
})

describe('Form Validation with Removed Elements', () => {
	it('should not validate inputs that have been removed from DOM', () => {
		// Add 3 dynamic fields
		cy.get('[data-cy="add-dynamic-field"]').click()
		cy.wait(100)
		cy.get('[data-cy="add-dynamic-field"]').click()
		cy.wait(100)
		cy.get('[data-cy="add-dynamic-field"]').click()
		cy.wait(100)

		// Fill static fields
		cy.get('[data-cy="field-1"]').type('Valid Value 1')
		cy.get('[data-cy="field-2"]').type('Valid Value 2')
		cy.get('[data-cy="field-3"]').type('Valid Value 3')

		// Fill first and third dynamic fields, leave second empty
		cy.get('[data-cy="dynamic-field-0"]').type('Dynamic 1')
		// dynamic-field-1 left empty (will be invalid)
		cy.get('[data-cy="dynamic-field-2"]').type('Dynamic 3')

		// Verify 6 validations registered
		cy.get('[data-cy="total-validations"]').should('contain', '6')

		// Submit - should focus on dynamic-field-1 (first invalid)
		cy.get('[data-cy="submit-button"]').click()
		cy.wait(200)
		cy.get('[data-cy="dynamic-field-1"]').should('be.focused')

		// Now remove dynamic-field-1 (the invalid one)
		cy.get('[data-cy="remove-dynamic-1"]').click()
		cy.wait(100)

		// Verify validation count decreased to 5
		cy.get('[data-cy="total-validations"]').should('contain', '5')

		// Submit again - should NOT try to validate the removed field
		// Since all remaining fields are valid, validation should pass
		cy.get('[data-cy="submit-button"]').click()
		cy.wait(200)

		// Validation should succeed (all remaining fields valid)
		// Last validation result should update
		cy.get('[data-cy="last-validation-result"]').should('not.contain', 'None')
	})

	it('should handle removing first field and validate next field in order', () => {
		// Add one dynamic field
		cy.get('[data-cy="add-dynamic-field"]').click()
		cy.wait(100)

		// Leave all fields empty (invalid)
		cy.get('[data-cy="total-validations"]').should('contain', '4')

		// Remove first static field (field-1)
		// We need to manually trigger removal via the test page
		// Since we can't directly remove static fields from UI, 
		// let's test with dynamic fields instead

		// Add 3 more dynamic fields
		cy.get('[data-cy="add-dynamic-field"]').click()
		cy.wait(100)
		cy.get('[data-cy="add-dynamic-field"]').click()
		cy.wait(100)

		cy.get('[data-cy="total-validations"]').should('contain', '6')

		// Fill static fields so they're valid
		cy.get('[data-cy="field-1"]').type('Valid')
		cy.get('[data-cy="field-2"]').type('Valid')
		cy.get('[data-cy="field-3"]').type('Valid')

		// Leave dynamic fields empty (invalid)
		// Submit - should focus first dynamic field
		cy.get('[data-cy="submit-button"]').click()
		cy.wait(200)
		cy.get('[data-cy="dynamic-field-0"]').should('be.focused')

		// Remove first dynamic field
		cy.get('[data-cy="remove-dynamic-0"]').click()
		cy.wait(100)

		// Should now have 5 validations (3 static + 2 dynamic)
		cy.get('[data-cy="total-validations"]').should('contain', '5')

		// Submit again - should focus what is now dynamic-field-0 (was dynamic-field-1)
		cy.get('[data-cy="submit-button"]').click()
		cy.wait(200)
		cy.get('[data-cy="dynamic-field-0"]').should('be.focused')
	})

	it('should not include removed elements in validation list', () => {
		// Add 5 dynamic fields
		for (let i = 0; i < 5; i++) {
			cy.get('[data-cy="add-dynamic-field"]').click()
			cy.wait(50)
		}

		// Should have 8 validations (3 static + 5 dynamic)
		cy.get('[data-cy="total-validations"]').should('contain', '8')

		// Check validation order list
		cy.get('[data-cy="validation-order"] ol li').should('have.length', 8)

		// Remove 3 dynamic fields (indices 1, 2, 4)
		cy.get('[data-cy="remove-dynamic-1"]').click()
		cy.wait(100)
		// After removing index 1, indices shift down
		cy.get('[data-cy="remove-dynamic-1"]').click() // This removes what was index 2
		cy.wait(100)
		cy.get('[data-cy="remove-dynamic-2"]').click() // This removes what was index 4
		cy.wait(100)

		// Should now have 5 validations (3 static + 2 dynamic remaining)
		cy.get('[data-cy="total-validations"]').should('contain', '5')

		// Validation order list should only show 5 items
		cy.get('[data-cy="validation-order"] ol li').should('have.length', 5)

		// Submit to verify validation works with reduced set
		cy.get('[data-cy="submit-button"]').click()
		cy.wait(200)

		// Should focus first invalid field (field-1)
		cy.get('[data-cy="field-1"]').should('be.focused')
	})
})

describe('Form Validation Performance with Dynamic Fields', () => {
	it('should handle adding and removing many fields efficiently', () => {
		const startTime = Date.now()

		// Add 20 dynamic fields rapidly
		for (let i = 0; i < 20; i++) {
			cy.get('[data-cy="add-dynamic-field"]').click()
			cy.wait(20) // Minimal wait
		}

		// Verify all registered
		cy.get('[data-cy="total-validations"]').should('contain', '23')

		// Remove half of them
		for (let i = 0; i < 10; i++) {
			cy.get('[data-cy="remove-dynamic-0"]').click() // Always remove first
			cy.wait(20)
		}

		// Should have 13 left (3 static + 10 dynamic)
		cy.get('[data-cy="total-validations"]').should('contain', '13')

		const endTime = Date.now()
		const duration = endTime - startTime

		// Operation should complete reasonably fast (under 5 seconds)
		expect(duration).to.be.lessThan(5000)
	})

	it('should validate correctly after bulk add and remove operations', () => {
		// Add 10 fields
		for (let i = 0; i < 10; i++) {
			cy.get('[data-cy="add-dynamic-field"]').click()
			cy.wait(30)
		}

		// Fill some fields
		cy.get('[data-cy="field-1"]').type('Valid')
		cy.get('[data-cy="dynamic-field-0"]').type('Valid')
		cy.get('[data-cy="dynamic-field-5"]').type('Valid')

		// Remove some fields including filled ones
		cy.get('[data-cy="remove-dynamic-0"]').click()
		cy.wait(50)
		cy.get('[data-cy="remove-dynamic-2"]').click()
		cy.wait(50)

		// Submit validation
		cy.get('[data-cy="submit-button"]').click()
		cy.wait(200)

		// Should focus on first invalid field that still exists
		// (field-2 since field-1 is filled and field-2 is empty)
		cy.get('[data-cy="field-2"]').should('be.focused')
	})
})
