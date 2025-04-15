import Uploader from './Uploader.js'
import LoadingImage from './blots/image.js'

class ImageUploader extends Uploader {
	constructor(quill, options) {
		super(quill, options, 'image/*')
		var toolbar = this.quill.getModule('toolbar')
		if (toolbar) {
			toolbar.addHandler('image', this.selectLocalFile.bind(this))
		}
	}

	getMimeTypesRegex() {
		return /^image\/(jpe?g|gif|png|svg|webp)$/i
	}

	getEmbedElementType() {
		return 'image'
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
					let base64ImageSrc = fileReader.result
					this.insertBase64Image(base64ImageSrc)
				}
			},
			false
		)

		if (file) {
			fileReader.readAsDataURL(file)
		}
		this.readAndUploadFile(file)
	}
	insertBase64Image(url) {
		const range = this.range

		this.placeholderDelta = this.quill.insertEmbed(
			range.index,
			LoadingImage.blotName,
			`${url}`,
			'user'
		)
	}

	fileCopied(file) {
		this.readAndUploadFile(file)
	}

	fileDropped(file) {
		this.readAndUploadFile(file)
	}
}

window.ImageUploader = ImageUploader
export default ImageUploader
