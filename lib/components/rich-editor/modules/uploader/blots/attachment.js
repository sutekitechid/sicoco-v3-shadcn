import Quill from 'quill'

const InlineBlot = Quill.import('blots/block/embed')

class Attachment extends InlineBlot {
	static create(src) {
		const node = super.create(src)
		if (src === true) return node

		node.setAttribute('href', src)
		node.setAttribute('target', '_blank')
		// set anchor tag with src as label
		const label = document.createElement('span')
		label.setAttribute('class', 'attachment-label')
		label.innerText = src.split('/').pop()
		node.appendChild(label)
		return node
	}
	deleteAt(index, length) {
		super.deleteAt(index, length)
		this.cache = {}
	}
	static value(domNode) {
		const { src, custom } = domNode.dataset
		return { src, custom }
	}
}

Attachment.blotName = 'anchor'
Attachment.className = 'image-uploading'
Attachment.tagName = 'a'
Quill.register({ 'formats/attachment': Attachment })

export default Attachment
