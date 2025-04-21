import Quill from 'quill'

const InlineBlot = Quill.import('blots/block/embed')

class LoadingImage extends InlineBlot {
	static create(src) {
		const node = super.create(src)
		if (src === true) return node

		node.setAttribute('src', src)
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

LoadingImage.blotName = 'image'
LoadingImage.tagName = 'img'
Quill.register({ 'formats/image': LoadingImage })

export default LoadingImage
