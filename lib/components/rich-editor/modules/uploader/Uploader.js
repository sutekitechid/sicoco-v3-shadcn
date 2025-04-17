import LoadingImage from './blots/image.js'
import CopyFileHandler from './handlers/CopyFileHandler'
import DropFileHandler from './handlers/DropFileHandler'
import SelectFileHandler from './handlers/SelectFileHandler'

class Uploader {
	constructor({ quill, options, blotName }) {
		this.quill = quill
		this.options = options
		this.blotName = blotName
		this.range = null
		this.placeholderDelta = null

		if (typeof this.options.upload !== 'function')
			console.warn(
				'[Missing config] upload function that returns a promise is required'
			)

		if (this.options.drag_and_drop !== false) {
			this.handleDrop = this.handleDrop.bind(this)
			this.quill.root.addEventListener('drop', this.handleDrop, false)
		}
		if (this.options.paste !== false) {
			this.handlePaste = this.handlePaste.bind(this)
			this.quill.root.addEventListener('paste', this.handlePaste, false)
		}
	}

	selectLocalFile() {
		const selectFileHandler = new SelectFileHandler(
			this.quill,
			this.options.upload,
			this.blotName,
			this.getMimeTypesRegex()
		)
		selectFileHandler.handleFile()
	}

	handleDrop(evt) {
		const dropFileHandler = new DropFileHandler(
			this.quill,
			this.options.upload,
			this.blotName,
			this.getMimeTypesRegex()
		)
		dropFileHandler.handleFile(evt)
	}

	handlePaste(evt) {
		const copyFileHandler = new CopyFileHandler(
			this.quill,
			this.options.upload,
			this.blotName,
			this.getMimeTypesRegex()
		)

		copyFileHandler.handleFile(evt)
	}

	getMimeTypesRegex() {
		throw new Error('getMimeTypesRegex not implemented')
	}
}

export default Uploader
