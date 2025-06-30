import { IHandler, BaseHandler } from './BaseHandler'
import Quill from 'quill'

export default class CopyFileHandler extends BaseHandler implements IHandler {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	range: any

	constructor(
		protected quill: Quill,
		protected uploadFunc: (file: File) => Promise<string>,
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
			const MIME_TYPES_REGEX = this.mimeTypes

			for (let i = 0; i < items.length; i++) {
				if (MIME_TYPES_REGEX.test(items[i].type)) {
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
