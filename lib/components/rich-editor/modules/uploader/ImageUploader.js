import Uploader from './Uploader.js'
import LoadingImage from './blots/image.js'

class ImageUploader extends Uploader {
	constructor(quill, options) {
		super(quill, options, LoadingImage.blotName)
		var toolbar = this.quill.getModule('toolbar')
		if (toolbar) {
			toolbar.addHandler('image', this.selectLocalFile.bind(this))
		}
	}

	getMimeTypesRegex() {
		return /^image\/(png|jpg|jpeg|gif|bmp|webp)$/i
	}
}

export default ImageUploader
