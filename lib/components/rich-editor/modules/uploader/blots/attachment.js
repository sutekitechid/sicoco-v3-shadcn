import Quill from 'quill'

const InlineBlot = Quill.import('blots/block')

class Attachment extends InlineBlot {
	static create(src) {
		const node = super.create(src)
		if (src === true) return node

		const anchor = document.createElement('a')
		anchor.setAttribute('href', src)
		anchor.setAttribute('target', '_blank')
		anchor.setAttribute('rel', 'noopener noreferrer')
		anchor.innerText = src.split('/').pop()
		node.appendChild(anchor)
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
Attachment.tagName = 'p'
Quill.register({ 'formats/attachment': Attachment })

export default Attachment
