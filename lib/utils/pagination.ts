export function getTotalPages(totalData: number, perPage: number | string) {
	return Math.ceil(totalData / Number(perPage))
}

export function handleInfiniteScroll(
	container: HTMLElement,
	loadMoreFn: () => void
) {
	if (container) {
		const { scrollTop, scrollHeight, clientHeight } = container
		if (scrollTop + clientHeight >= scrollHeight - 10) {
			loadMoreFn()
		}
	}
}
