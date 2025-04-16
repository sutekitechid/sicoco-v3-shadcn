import { IHandler, BaseHandler } from './BaseHandler'
import Quill from 'quill'

export default class DropFileHandler extends BaseHandler implements IHandler {
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

	handleFile(evt: DragEvent): void {
		if (
			evt.dataTransfer &&
			evt.dataTransfer.files &&
			evt.dataTransfer.files.length
		) {
			evt.stopPropagation()
			evt.preventDefault()
			if (document.caretRangeFromPoint) {
				const selection = document.getSelection()
				const range = document.caretRangeFromPoint(evt.clientX, evt.clientY)
				if (selection && range) {
					selection.setBaseAndExtent(
						range.startContainer,
						range.startOffset,
						range.startContainer,
						range.startOffset
					)
				}
			} else {
				const selection = document.getSelection()
				const range = document.caretPositionFromPoint(evt.clientX, evt.clientY)
				if (selection && range) {
					selection.setBaseAndExtent(
						range.offsetNode,
						range.offset,
						range.offsetNode,
						range.offset
					)
				}
			}

			this.quill.focus()
			this.range = this.quill.getSelection()
			let files = evt.dataTransfer.files

			for (let i = 0; i < files.length; i++) {
				setTimeout(() => {
					const file = files[i]
					this.quill.focus()
					this.range = this.quill.getSelection()
					this.uploadFile(file)
				}, 0)
			}
		}
	}
}
