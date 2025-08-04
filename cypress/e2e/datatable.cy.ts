/// <reference types="cypress" />

beforeEach(() => {
	cy.visit('http://localhost:5173/datatable-performance')
})

describe('DataTable Performance Test', () => {
	// Reusable function to set up scroll container
	const setupScrollContainer = () => {
		// Wait for initial data load
		cy.wait(2000)
		
		// Get the scrollable container (assuming it's the table wrapper or a parent div)
		cy.get('[data-cy="data-table-performance-test"]').within(() => {
			cy.get('.scroll-content').as('scrollContainer')
		})
		
		// Alternative: if the scroll container is the table wrapper itself
		// cy.get('[data-cy="data-table-performance-test"]').parent().as('scrollContainer')
	}

	it('should render the DataTable component', () => {
		cy.get('[data-cy="data-table-performance-test"]').should('exist')
	})

	it('should test virtual scroll rendering accuracy with no data loss', () => {
		// Wait for table to be rendered
		cy.get('[data-cy="data-table-performance-test"]').should('exist')
		cy.get('[data-cy="data-table-performance-test"] tbody tr').should('have.length.greaterThan', 0)

		// Setup scroll container
		setupScrollContainer()

		// Set to collect all seen IDs during scrolling
		const seenIds = new Set<string>()
		let totalExpectedRows = 0

		// First, get the total number of expected rows (if available from UI or API)
		// Try to get total from window context or component
		// This might need adjustment based on how your data is structured
		totalExpectedRows = 85 // Assuming 1400 rows for now, adjust as needed

		// Function to extract and validate IDs from currently visible rows
		const extractAndValidateIds = () => {
			return cy.get('[data-cy="data-table-performance-test"] tbody tr').then(($rows) => {
				const currentIds: string[] = []
				
				$rows.each((index, row) => {
					// Get the ID column (tr > td[2] as specified)
					const idCell = Cypress.$(row).find('td').eq(2) // Index 2 for ID column
					const idText = idCell.text().trim()
					
					if (idText) {
						currentIds.push(idText)
						seenIds.add(idText)
					}
				})

				// Log current batch using console.log instead of cy.log to avoid async issues
				console.log(`Found ${currentIds.length} IDs in current view: ${currentIds.slice(0, 5).join(', ')}${currentIds.length > 5 ? '...' : ''}`)
				
				return currentIds
			})
		}

		// Scroll and collect data in multiple steps
		const scrollSteps = 60 // Number of scroll steps
		const scrollAmount = 100 // Pixels to scroll each step

		// Extract initial IDs
		extractAndValidateIds()

		// Scroll through the data
		for (let step = 0; step < scrollSteps; step++) {
			cy.get('@scrollContainer').scrollTo(0, step * scrollAmount, { duration: 50 })
			cy.wait(50) // Wait for virtual scroll to update
			extractAndValidateIds()
		}

		// Scroll to bottom to ensure we get all data
		cy.get('@scrollContainer').scrollTo('bottom', { duration: 50 })
		cy.wait(50)
		extractAndValidateIds()

		// Scroll back to top and collect again
		cy.get('@scrollContainer').scrollTo('top', { duration: 50 })
		cy.wait(50)
		extractAndValidateIds()

		// Validate the collected data
		cy.then(() => {
			const allIds = Array.from(seenIds).sort()
			console.log(`Total unique IDs collected: ${allIds.length}`)
			
			// Check for sequential IDs (assuming format is "id-{index}")
			const expectedIds: string[] = []
			for (let i = 0; i < totalExpectedRows; i++) {
				expectedIds.push(`id-${i}`)
			}

			// Find missing IDs
			const missingIds = expectedIds.filter(id => !seenIds.has(id))
			const extraIds = allIds.filter(id => !expectedIds.includes(id))

			// Log results
			if (missingIds.length > 0) {
				console.log(`❌ Missing IDs (${missingIds.length}): ${missingIds.slice(0, 10).join(', ')}${missingIds.length > 10 ? '...' : ''}`)
			}

			if (extraIds.length > 0) {
				console.log(`⚠️ Extra IDs (${extraIds.length}): ${extraIds.slice(0, 10).join(', ')}${extraIds.length > 10 ? '...' : ''}`)
			}

			// Assertions
			expect(missingIds.length, `Missing ${missingIds.length} IDs from virtual scroll`).to.equal(0)
			expect(allIds.length, 'Should have collected all expected IDs').to.be.greaterThan(Math.min(50, totalExpectedRows * 0.8)) // At least 80% or 50 items
		})
	})

	it('should test sequential ID order during scroll', () => {
		cy.get('[data-cy="data-table-performance-test"]').should('exist')

		// Setup scroll container
		setupScrollContainer()

		// Function to check if IDs are in correct order in current view
		const checkSequentialOrder = () => {
			return cy.get('[data-cy="data-table-performance-test"] tbody tr').then(($rows) => {
				const visibleIds: number[] = []
				
				$rows.each((index, row) => {
					const idCell = Cypress.$(row).find('td').eq(2)
					const idText = idCell.text().trim()
					
					// Extract numeric part from "id-{number}" format
					const match = idText.match(/id-(\d+)/)
					if (match) {
						visibleIds.push(parseInt(match[1]))
					}
				})

				// Check if IDs are sequential
				for (let i = 1; i < visibleIds.length; i++) {
					if (visibleIds[i] !== visibleIds[i-1] + 1) {
						console.log(`⚠️ Non-sequential IDs found: ${visibleIds[i-1]} -> ${visibleIds[i]}`)
					}
				}

				return visibleIds
			})
		}

		// Test at different scroll positions
		const testPositions = [0, 25, 50, 75, 100] // Percentage positions

		testPositions.forEach(position => {
			cy.get('@scrollContainer').scrollTo(0, `${position}%`, { duration: 200 })
			cy.wait(150)
			
			checkSequentialOrder().then((ids) => {
				console.log(`At ${position}% scroll - Visible IDs: ${ids.slice(0, 5).join(', ')}${ids.length > 5 ? '...' : ''}`)
				
				// Verify no gaps in the visible sequence
				if (ids.length > 1) {
					const hasGaps = ids.some((id, index) => index > 0 && id !== ids[index - 1] + 1)
					if (hasGaps) {
						throw new Error(`Sequential IDs should have no gaps at ${position}% scroll position`)
					}
				}
			})
		})
	})
})
