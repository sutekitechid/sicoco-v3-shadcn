class Uploader {
	constructor(quill, options, mimeTypes) {
		this.quill = quill
		this.options = options
		this.range = null
		this.placeholderDelta = null
		this.acceptedMimeTypes = mimeTypes

		if (typeof this.options.upload !== 'function')
			console.warn(
				'[Missing config] upload function that returns a promise is required'
			)

		this.handleDrop = this.handleDrop.bind(this)
		this.handlePaste = this.handlePaste.bind(this)

		this.quill.root.addEventListener('drop', this.handleDrop, false)
		this.quill.root.addEventListener('paste', this.handlePaste, false)
	}

	selectLocalFile() {
		this.quill.focus()
		this.range = this.quill.getSelection()
		this.fileHolder = document.createElement('input')
		this.fileHolder.setAttribute('type', 'file')
		this.fileHolder.setAttribute('accept', this.acceptedMimeTypes)
		this.fileHolder.setAttribute('style', 'visibility:hidden')
		// this.fileHolder.setAttribute('multiple', 'multiple')

		this.fileHolder.onchange = () => this.fileSelected(this.fileHolder.files[0])

		document.body.appendChild(this.fileHolder)

		this.fileHolder.click()

		window.requestAnimationFrame(() => {
			document.body.removeChild(this.fileHolder)
		})
	}

	fileSelected(file) {
		throw new Error('You have to implement the method fileAdded!')
	}

	handleDrop(evt) {
		if (
			evt.dataTransfer &&
			evt.dataTransfer.files &&
			evt.dataTransfer.files.length
		) {
			evt.stopPropagation()
			evt.preventDefault()
			if (document.caretRangeFromPoint) {
				const selection = document.getSelection()
				const range = document.caretRangeFromPoint(evt.clientX, evt.clientY)
				if (selection && range) {
					selection.setBaseAndExtent(
						range.startContainer,
						range.startOffset,
						range.startContainer,
						range.startOffset
					)
				}
			} else {
				const selection = document.getSelection()
				const range = document.caretPositionFromPoint(evt.clientX, evt.clientY)
				if (selection && range) {
					selection.setBaseAndExtent(
						range.offsetNode,
						range.offset,
						range.offsetNode,
						range.offset
					)
				}
			}

			this.quill.focus()
			this.range = this.quill.getSelection()
			let files = evt.dataTransfer.files

			for (let i = 0; i < files.length; i++) {
				if (this.getMimeTypesRegex().test(files[i].type)) {
					const file = files[i]
					setTimeout(() => {
						this.quill.focus()
						this.range = this.quill.getSelection()
						this.fileDropped(file)
					}, 0)
				}
			}
		}
	}

	fileDropped(file) {
		throw new Error('You have to implement the method fileAdded!')
	}

	handlePaste(evt) {
		let clipboard = evt.clipboardData || window.clipboardData

		// IE 11 is .files other browsers are .items
		if (clipboard && (clipboard.items || clipboard.files)) {
			let items = clipboard.items || clipboard.files
			const FILE_MIME_REGEX = this.getMimeTypesRegex()

			for (let i = 0; i < items.length; i++) {
				if (FILE_MIME_REGEX.test(items[i].type)) {
					let file = items[i].getAsFile ? items[i].getAsFile() : items[i]

					if (file) {
						this.quill.focus()
						this.range = this.quill.getSelection()
						evt.preventDefault()
						evt.stopPropagation()
						setTimeout(() => {
							this.quill.focus()
							this.range = this.quill.getSelection()
							this.fileCopied(file)
						}, 0)
					}
				}
			}
		}
	}

	fileCopied(file) {
		throw new Error('You have to implement the method fileAdded!')
	}

	getMimeTypesRegex() {
		throw new Error('You have to implement the method getMimeTypesRegex!')
	}

	readAndUploadFile(file) {
		this.options
			.upload(file)
			.then(
				fileUrl => {
					this.insertToEditor(fileUrl)
				},
				error => {
					console.warn(error)
				}
			)
			.finally(() => {
				// Delete the placeholder image
				this.quill.deleteText(this.range.index, 1, 'user')
			})
	}

	insertToEditor(url) {
		const range = this.range
		// Insert the server saved file
		this.quill.insertEmbed(
			range.index,
			this.getEmbedElementType(),
			`${url}`,
			'user'
		)

		range.index++
		this.quill.setSelection(range, 'user')
	}

	getEmbedElementType(url) {
		throw new Error('You have to implement the method getEmbedElement!')
	}
}

export default Uploader
