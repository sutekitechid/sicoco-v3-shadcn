export const upsertArray = (array, element) => {
	if (Array.isArray(element) && element.length > 0) {
		element.forEach(item => {
			if (array.includes(item)) {
				array = array.filter(e => e !== item) // Remove existing item
			} else {
				array.push(item)
			}
		})
	} else {
		if (!array) array = []
		const elIndex = array.indexOf(element)
		if (elIndex > -1) {
			// remove item using slice
			array.splice(elIndex, 1)
		} else {
			array.push(element)
		}
	}
	return array
}

export const isFilledArray = array => {
	return Array.isArray(array) && array.length > 0
}
