import Attachment from './blots/attachment'
import SelectFileHandler from './handlers/SelectFileHandler'

class AttachmentUploader {
	constructor(quill, options) {
		this.quill = quill
		this.options = options
		this.blotName = Attachment.blotName
		this.range = null
		this.placeholderDelta = null

		if (typeof this.options.upload !== 'function')
			console.warn(
				'[Missing config] upload function that returns a promise is required'
			)
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

	getMimeTypesRegex() {
		return /^(?!image|video).*/i
	}
}

export default AttachmentUploader
