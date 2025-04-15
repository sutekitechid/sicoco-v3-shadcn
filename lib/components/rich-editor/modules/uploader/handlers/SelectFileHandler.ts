import { IHandler, BaseHandler } from './BaseHandler'
import Quill from 'quill'

export default class SelectFileHandler implements IHandler {
	range: any
	fileHolder: HTMLInputElement
	placeholderDelta: any

	constructor(
		protected quill: Quill,
		protected uploadFunc: (file: File) => Promise<String>,
		protected blotName: string,
		protected mimeTypes: RegExp
	) {
		this.quill = quill
		this.blotName = blotName
		this.uploadFunc = uploadFunc
		this.mimeTypes = mimeTypes
	}

	handleFile(evt: DragEvent): void {
		this.quill.focus()
		this.range = this.quill.getSelection()
		this.fileHolder = document.createElement('input')
		this.fileHolder.setAttribute('type', 'file')
		this.fileHolder.setAttribute('accept', `${this.blotName}/*`)
		this.fileHolder.setAttribute('style', 'visibility:hidden')

		// multiple file selection
		this.fileHolder.setAttribute('multiple', '')

		this.fileHolder.onchange = this.fileChanged.bind(this)

		document.body.appendChild(this.fileHolder)

		this.fileHolder.click()

		window.requestAnimationFrame(() => {
			document.body.removeChild(this.fileHolder)
		})
	}

	fileChanged() {
		const files = this.fileHolder.files
		for (let i = 0; i < files.length; i++) {
			const file = files[i]
			if (!this.mimeTypes.test(file.type)) {
				continue
			}
			this.showFilePreview(file)
			this.uploadFile(file)
		}
	}

	showFilePreview(file: File) {
		const fileReader = new FileReader()

		fileReader.addEventListener(
			'load',
			() => {
				let base64ImageSrc = fileReader.result
				this.insertBase64File(base64ImageSrc)
			},
			false
		)

		if (file) {
			fileReader.readAsDataURL(file)
		}
	}

	insertBase64File(url: string | ArrayBuffer) {
		const range = this.range

		this.placeholderDelta = this.quill.insertEmbed(
			range.index,
			this.blotName,
			`${url}`,
			'user'
		)
	}

	uploadFile(file: File) {
		this.uploadFunc(file)
			.then(
				(fileUrl: string) => {
					this.insertFileIntoEditor(fileUrl)
				},
				error => {
					console.warn(error)
				}
			)
			.finally(() => {
				// select file use this to remove the placeholder image
				this.removeBase64File()
			})
	}

	insertFileIntoEditor(url: string) {
		const range = this.range

		// Insert the server saved image
		this.quill.insertEmbed(range.index, this.blotName, `${url}`, 'user')

		range.index++
		this.quill.setSelection(range, 'user')
	}

	removeBase64File() {
		const range = this.range
		const lengthToDelete = this.calculatePlaceholderInsertLength()

		this.quill.deleteText(range.index, lengthToDelete, 'user')
	}

	// The length of the insert delta from insertBase64Image can vary depending on what part of the line the insert occurs
	calculatePlaceholderInsertLength() {
		return this.placeholderDelta.ops.reduce((accumulator, deltaOperation) => {
			if (deltaOperation.hasOwnProperty('insert')) accumulator++

			return accumulator
		}, 0)
	}
}
