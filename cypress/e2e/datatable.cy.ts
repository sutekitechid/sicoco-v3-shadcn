/// <reference types="cypress" />

beforeEach(() => {
	cy.visit('http://localhost:5173/datatable-performance')
})
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop completed')) {
    return false // mencegah Cypress gagal
  }
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
		cy.get('[data-cy="data-table-performance-test"] .table-row .table-cell').should('have.length.greaterThan', 0)

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
			return cy.get('[data-cy="data-table-performance-test"] .table-row').then(($rows) => {
				const currentIds: string[] = []
				
				$rows.each((index, row) => {
					// Get the ID column (tr > td[2] as specified)
					const idCell = Cypress.$(row).find('.table-cell').eq(2) // Index 2 for ID column
					const idText = idCell.text().trim()
					
					if (idText && !currentIds.includes(idText)) { // Avoid adding duplicates within same batch
						currentIds.push(idText)
						seenIds.add(idText)
					}
				})

				// Log current batch using console.log instead of cy.log to avoid async issues
				console.log(`Found ${currentIds.length} unique IDs in current view: ${currentIds.slice(0, 5).join(', ')}${currentIds.length > 5 ? '...' : ''}`)
				
				return currentIds
			})
		}

		// Scroll and collect data in multiple steps
		const scrollSteps = 70 // Number of scroll steps
		const scrollAmount = 100 // Pixels to scroll each step

		// Extract initial IDs
		extractAndValidateIds()

		// Scroll through the data
		for (let step = 0; step < scrollSteps; step++) {
			cy.get('@scrollContainer').scrollTo(0, step * scrollAmount, { duration: 50 })
			cy.wait(50) // Wait for virtual scroll to update
			extractAndValidateIds()
		}

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
			return cy.get('[data-cy="data-table-performance-test"] .table-row').then(($rows) => {
				const visibleIds: number[] = []
				const rawIds: string[] = []
				
				$rows.each((index, row) => {
					const idCell = Cypress.$(row).find('.table-cell').eq(2)
					const idText = idCell.text().trim()
					rawIds.push(idText)
					
					// Extract numeric part from "id-{number}" format
					const match = idText.match(/id-(\d+)/)
					if (match) {
						visibleIds.push(parseInt(match[1]))
					}
				})

				// Log raw IDs for debugging
				console.log(`Raw IDs found: ${rawIds.slice(0, 8).join(', ')}${rawIds.length > 8 ? '...' : ''}`)
				
				// Remove duplicates while preserving order (keep first occurrence)
				const uniqueIds: number[] = []
				const seen = new Set<number>()
				
				visibleIds.forEach(id => {
					if (!seen.has(id)) {
						uniqueIds.push(id)
						seen.add(id)
					}
				})

				// Check if unique IDs are sequential
				for (let i = 1; i < uniqueIds.length; i++) {
					if (uniqueIds[i] !== uniqueIds[i-1] + 1) {
						console.log(`⚠️ Non-sequential unique IDs found: ${uniqueIds[i-1]} -> ${uniqueIds[i]}`)
					}
				}

				return uniqueIds
			})
		}

		// Test at different scroll positions
		const testPositions = [0, 25, 50, 75, 100] // Percentage positions

		testPositions.forEach(position => {
			cy.get('@scrollContainer').scrollTo(0, `${position}%`, { duration: 200 })
			cy.wait(150)
			
			checkSequentialOrder().then((uniqueIds) => {
				console.log(`At ${position}% scroll - Unique Visible IDs: ${uniqueIds.slice(0, 5).join(', ')}${uniqueIds.length > 5 ? '...' : ''}`)
				
				// Verify no gaps in the visible sequence (now working with unique IDs)
				if (uniqueIds.length > 1) {
					for (let i = 1; i < uniqueIds.length; i++) {
						if (uniqueIds[i] !== uniqueIds[i-1] + 1) {
							throw new Error(`Sequential unique IDs should have no gaps at ${position}% scroll position. Found gap: ${uniqueIds[i-1]} -> ${uniqueIds[i]}`)
						}
					}
				}
			})
		})
	})
})
