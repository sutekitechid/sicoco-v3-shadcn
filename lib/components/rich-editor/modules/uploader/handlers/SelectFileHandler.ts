import { IHandler } from './BaseHandler'
import Quill from 'quill'

type DeltaOperation = { insert?: unknown }
type PlaceholderDelta = { ops?: DeltaOperation[] }

export default class SelectFileHandler implements IHandler {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	range: any
	fileHolder!: HTMLInputElement
	placeholderDelta: PlaceholderDelta | null = null

	constructor(
		protected quill: Quill,
		protected uploadFunc: (file: File) => Promise<string>,
		protected blotName: string,
		protected mimeTypes: RegExp
	) {
		this.quill = quill
		this.blotName = blotName
		this.uploadFunc = uploadFunc
		this.mimeTypes = mimeTypes
	}

	handleFile(): void {
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

	fileChanged(): void {
		const files = this.fileHolder.files
		if (!files) return

		for (let i = 0; i < files.length; i++) {
			const file = files.item(i)
			if (!file || !this.mimeTypes.test(file.type)) {
				continue
			}
			this.showFilePreview(file)
			this.uploadFile(file)
		}
	}

	showFilePreview(file: File): void {
		// if file is not image nor video, return
		if (!this.isVideoFile(file) && !this.isAudioFile(file)) {
			return
		}

		const fileReader = new FileReader()

		fileReader.addEventListener(
			'load',
			() => {
				const base64ImageSrc = fileReader.result
				if (base64ImageSrc === null) return
				this.insertBase64File(base64ImageSrc)
			},
			false
		)

		fileReader.readAsDataURL(file)
	}

	insertBase64File(url: string | ArrayBuffer): void {
		const range = this.range

		this.placeholderDelta = this.quill.insertEmbed(
			range.index,
			this.blotName,
			`${url}`,
			'user'
		)
	}

	async uploadFile(file: File): Promise<void> {
		try {
			const fileUrl = await this.uploadFunc(file)
			this.insertFileIntoEditor(fileUrl)
		} catch (error) {
			console.error('Error uploading file:', error)
		} finally {
			// if file is not image nor video, return
			if (!this.isVideoFile(file) && !this.isAudioFile(file)) {
				return
			}
			// select file use this to remove the placeholder image
			this.removeBase64File()
		}
	}

	isVideoFile(file: File): boolean {
		return file.type.startsWith('video/')
	}

	isAudioFile(file: File): boolean {
		return file.type.startsWith('audio/')
	}

	insertFileIntoEditor(url: string): void {
		const range = this.range

		// Insert the server saved image
		this.quill.insertEmbed(range.index, this.blotName, `${url}`, 'user')

		range.index++
		this.quill.setSelection(range, 'user')
	}

	removeBase64File(): void {
		const range = this.range
		const lengthToDelete = this.calculatePlaceholderInsertLength()

		this.quill.deleteText(range.index, lengthToDelete, 'user')
	}

	// The length of the insert delta from insertBase64Image can vary depending on what part of the line the insert occurs
	calculatePlaceholderInsertLength(): number {
		return this.placeholderDelta?.ops?.reduce((accumulator: number, deltaOperation: DeltaOperation) => {
			if ('insert' in deltaOperation) return accumulator + 1
			return accumulator
		}, 0) ?? 0
	}
}
