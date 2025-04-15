import Uploader from './Uploader.js'

class VideoUploader extends Uploader {
	constructor(quill, options) {
		super(quill, options, 'video/*')
		var toolbar = this.quill.getModule('toolbar')
		if (toolbar) {
			toolbar.addHandler('video', this.selectLocalFile.bind(this))
		}
	}

	getMimeTypesRegex() {
		return /^video\/(mp4|webm|ogg)$/i
	}

	getEmbedElementType() {
		return 'video'
	}

	// Override the readAndUploadFile method to handle image upload
	fileSelected(file) {
		this.range = this.quill.getSelection()
		let isUploadReject = false

		const fileReader = new FileReader()

		fileReader.addEventListener(
			'load',
			() => {
				if (!isUploadReject) {
					let base64VideoSrc = fileReader.result
					this.insertBase64Video(base64VideoSrc)
				}
			},
			false
		)

		if (file) {
			fileReader.readAsDataURL(file)
		}
		this.readAndUploadFile(file)
	}
	insertBase64Video(url) {
		const range = this.range

		this.placeholderDelta = this.quill.insertEmbed(
			range.index,
			'video',
			`${url}`,
			'user'
		)
	}

	fileCopied(file) {
		this.fileSelected(file)
	}

	fileDropped(file) {
		this.fileSelected(file)
	}
}

window.VideoUploader = VideoUploader
export default VideoUploader
