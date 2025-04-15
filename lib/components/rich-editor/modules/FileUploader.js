import Uploader from './Uploader.js'

class FileUploader extends Uploader {
	constructor(quill, options) {
		super(quill, options, '*')
		var toolbar = this.quill.getModule('toolbar')
		if (toolbar) {
			console.log('toolbar', toolbar)
			toolbar.addHandler('attachment', this.selectLocalFile.bind(this))
		}
	}

	getMimeTypesRegex() {
		// return all mime types except for image and video
		return /^(?!image|video).*/i
	}

	getEmbedElementType() {
		return 'a'
	}

	// Override the readAndUploadFile method to handle image upload
	fileAdded(file) {
		// this.range = this.quill.getSelection()
		// let isUploadReject = false

		// const fileReader = new FileReader()

		// fileReader.addEventListener(
		// 	'load',
		// 	() => {
		// 		if (!isUploadReject) {
		// 			let base64VideoSrc = fileReader.result
		// 			this.insertBase64Video(base64VideoSrc)
		// 		}
		// 	},
		// 	false
		// )

		// if (file) {
		// 	fileReader.readAsDataURL(file)
		// }
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
}

window.FileUploader = FileUploader
export default FileUploader
