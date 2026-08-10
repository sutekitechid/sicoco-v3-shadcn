/// <reference types="cypress" />

beforeEach(() => {
	cy.visit('http://localhost:5173/#/datepicker')
})

Cypress.on('uncaught:exception', error => {
	if (error.message.includes('ResizeObserver loop completed')) {
		return false
	}
})

function enterDate(prefix: string, day: string, month: string, year: string) {
	cy.get(`[data-cy="${prefix}-day"]`).clear().type(day)
	cy.get(`[data-cy="${prefix}-month"]`).clear().type(month)
	cy.get(`[data-cy="${prefix}-year"]`).clear().type(year)
}

describe('DatePicker', () => {
	it('updates the model after entering a date', () => {
		cy.get('[data-cy="datepicker-basic-display"]').click()

		enterDate('datepicker-basic', '15', '08', '2025')

		cy.get('[data-cy="datepicker-basic-value"]').should(
			'contain',
			'15-08-2025'
		)
	})

	it('renders one editable trigger with start and end segments in range mode', () => {
		cy.get('[data-cy="datepicker-range-display"]').click()

		cy.get('[data-cy="datepicker-range-day"]').should('have.value', '01')
		cy.get('[data-cy="datepicker-range-month"]').should('have.value', '01')
		cy.get('[data-cy="datepicker-range-year"]').should('have.value', '2024')
		cy.get('[data-cy="datepicker-range-end-day"]').should('have.value', '01')
		cy.get('[data-cy="datepicker-range-end-month"]').should('have.value', '12')
		cy.get('[data-cy="datepicker-range-end-year"]').should('have.value', '2026')
	})

	it('validates a required date when the form is submitted', () => {
		cy.get('[data-cy="datepicker-form-submit"]').click()
		cy.contains('Tanggal wajib diisi').should('be.visible')
		enterDate('datepicker-form', '12', '06', '2025')
		cy.get('[data-cy="datepicker-form-submit"]').click()

		cy.get('[data-cy="datepicker-form-result"]').should(
			'contain',
			'Form valid! Tanggal: 12-06-2025'
		)
	})

	it('shows the custom validation message for a Sunday', () => {
		cy.get('[data-cy="datepicker-validators-display"]').click()
		enterDate('datepicker-validators', '04', '08', '2024')
		cy.get('[data-cy="datepicker-validators-year"]').blur()

		cy.contains('Tanggal tidak boleh hari Minggu').should('be.visible')

		enterDate('datepicker-validators', '05', '08', '2024')
		cy.get('[data-cy="datepicker-validators-year"]').blur()
		cy.contains('Tanggal tidak boleh hari Minggu').should('not.exist')
	})

	it('does not open the calendar when disabled', () => {
		cy.get('[data-cy="datepicker-disabled-calendar-icon"]').should('be.disabled')
		cy.get('[data-cy="datepicker-disabled-calendar-icon"]').click({ force: true })
		cy.get('[data-cy="datepicker-disabled-calendar-next-button"]')
			.filter(':visible')
			.should('not.exist')
	})

	it('opens the calendar popover and closes it when clicking outside', () => {
		cy.get('[data-cy="datepicker-basic-calendar-icon"]').click()
		cy.get('[data-cy="datepicker-basic-calendar-next-button"]')
			.filter(':visible')
			.should('exist')

		cy.get('[data-cy="datepicker-basic-value"]').click()
		cy.get('[data-cy="datepicker-basic-calendar-next-button"]')
			.filter(':visible')
			.should('not.exist')
	})
})
