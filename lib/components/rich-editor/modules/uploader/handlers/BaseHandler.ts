import Quill from 'quill'

export interface IHandler {
	handleFile: (evt: Event) => void
}

export class BaseHandler {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	range: any

	constructor(
		protected quill: Quill,
		protected uploadFunc: (file: File) => Promise<string>,
		protected blotName: string
	) {
		this.quill = quill
		this.blotName = blotName
		this.uploadFunc = uploadFunc
	}

	async uploadFile(file: File): Promise<void> {
		try {
			const fileUrl = await this.uploadFunc(file)

			this.insertFileIntoEditor(fileUrl)
		} catch (error) {
			console.error('Error uploading file:', error)
		} finally {
			this.quill.deleteText(this.range.index, 1, 'user')
		}
	}

	insertFileIntoEditor(url: string) {
		const range = this.range
		this.quill.insertEmbed(range.index, this.blotName, `${url}`, 'user')

		range.index++
		this.quill.setSelection(range, 'user')
	}
}
