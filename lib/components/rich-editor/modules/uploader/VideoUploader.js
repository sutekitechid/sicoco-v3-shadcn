import LoadingVideo from './blots/video'
import SelectFileHandler from './handlers/SelectFileHandler'

class VideoUploader {
	constructor(quill, options) {
		this.quill = quill
		this.options = options
		this.blotName = LoadingVideo.blotName
		this.range = null
		this.placeholderDelta = null

		if (typeof this.options.upload !== 'function')
			console.warn(
				'[Missing config] upload function that returns a promise is required'
			)

		var toolbar = this.quill.getModule('toolbar')
		if (toolbar) {
			toolbar.addHandler('video', this.selectLocalFile.bind(this))
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

	getMimeTypesRegex() {
		return /^video\/(mp4|webm|ogg)$/i
	}
}

export default VideoUploader
