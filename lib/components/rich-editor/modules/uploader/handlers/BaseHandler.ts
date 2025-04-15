import Quill from 'quill'

export interface IHandler {
	handleFile: (evt: Event) => void
}

export class BaseHandler {
	range: any

	constructor(
		protected quill: Quill,
		protected uploadFunc: (file: File) => Promise<String>,
		protected blotName: string
	) {
		this.quill = quill
		this.blotName = blotName
		this.uploadFunc = uploadFunc
	}

	uploadFile(file: File): void {
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
				this.quill.deleteText(this.range.index, 1, 'user')
			})
	}

	insertFileIntoEditor(url: string) {
		const range = this.range
		console.log('blotName', this.blotName)
		this.quill.insertEmbed(range.index, this.blotName, `${url}`, 'user')

		range.index++
		this.quill.setSelection(range, 'user')
	}
}
