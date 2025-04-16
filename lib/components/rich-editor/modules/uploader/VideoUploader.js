import Uploader from './Uploader.js'
import LoadingVideo from './blots/video.js'

class VideoUploader extends Uploader {
	constructor(quill, options) {
		options.drag_and_drop = false
		options.paste = false
		super(quill, options, LoadingVideo.blotName)
		var toolbar = this.quill.getModule('toolbar')
		if (toolbar) {
			toolbar.addHandler('video', this.selectLocalFile.bind(this))
		}
	}

	getMimeTypesRegex() {
		return /^video\/(mp4|webm|ogg)$/i
	}
}

export default VideoUploader
