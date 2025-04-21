import LoadingImage from './blots/image.js'
import CopyFileHandler from './handlers/CopyFileHandler'
import DropFileHandler from './handlers/DropFileHandler'
import SelectFileHandler from './handlers/SelectFileHandler'

class ImageUploader {
	constructor(quill, options) {
		this.quill = quill
		this.options = options
		this.blotName = LoadingImage.blotName
		this.range = null
		this.placeholderDelta = null

		if (typeof this.options.upload !== 'function')
			console.warn(
				'[Missing config] upload function that returns a promise is required'
			)

		var toolbar = this.quill.getModule('toolbar')
		if (toolbar) {
			toolbar.addHandler('image', this.selectLocalFile.bind(this))
		}

		this.handleDrop = this.handleDrop.bind(this)
		this.quill.root.addEventListener('drop', this.handleDrop, false)

		this.handlePaste = this.handlePaste.bind(this)
		this.quill.root.addEventListener('paste', this.handlePaste, false)
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
		return /^image\/(png|jpg|jpeg|gif|bmp|webp)$/i
	}
}

export default ImageUploader
