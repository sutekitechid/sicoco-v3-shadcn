import { IHandler, BaseHandler } from './BaseHandler'
import Quill from 'quill'

export default class DropFileHandler extends BaseHandler implements IHandler {
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
				/**
				 * TODO: this block is commented out because it is not working when building
				 */
				// } else {
				// 	const selection = document.getSelection()
				// 	const range = document.caretPositionFromPoint(evt.clientX, evt.clientY)
				// 	if (selection && range) {
				// 		selection.setBaseAndExtent(
				// 			range.offsetNode,
				// 			range.offset,
				// 			range.offsetNode,
				// 			range.offset
				// 		)
				// 	}
			}
			//TODO: need to fix this, this code make build error
			// else {
			// 	const selection = document.getSelection()
			// 	const range = document.caretPositionFromPoint(evt.clientX, evt.clientY)
			// 	if (selection && range) {
			// 		selection.setBaseAndExtent(
			// 			range.offsetNode,
			// 			range.offset,
			// 			range.offsetNode,
			// 			range.offset
			// 		)
			// 	}
			// }

			this.quill.focus()
			this.range = this.quill.getSelection()
			let files = evt.dataTransfer.files

			const MIME_TYPES_REGEX = this.mimeTypes
			for (let i = 0; i < files.length; i++) {
				const file = files[i]
				if (MIME_TYPES_REGEX.test(file.type)) {
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
