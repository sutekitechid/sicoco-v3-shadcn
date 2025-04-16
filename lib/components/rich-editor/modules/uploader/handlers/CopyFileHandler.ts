import { IHandler, BaseHandler } from './BaseHandler'
import Quill from 'quill'

export default class CopyFileHandler extends BaseHandler implements IHandler {
	range: any

	constructor(
		protected quill: Quill,
		protected uploadFunc: (file: File) => Promise<String>,
		protected blotName: string,
		protected mimeTypes: RegExp
	) {
		super(quill, uploadFunc, blotName)
		this.mimeTypes = mimeTypes
	}
	handleFile(evt: Event): void {
		const clipboardData = (evt as ClipboardEvent).clipboardData
		if (clipboardData) {
			const items = clipboardData.files
			const IMAGE_MIME_REGEX = this.mimeTypes

			for (let i = 0; i < items.length; i++) {
				if (IMAGE_MIME_REGEX.test(items[i].type)) {
					let file = items[i]

					if (file) {
						this.quill.focus()
						this.range = this.quill.getSelection()
						evt.preventDefault()
						setTimeout(() => {
							this.quill.focus()
							this.range = this.quill.getSelection()
							this.uploadFile(file)
						}, 0)
					}
				}
			}
		}
	}
}
