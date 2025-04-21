import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class LoadingVideo extends BlockEmbed {
	static create(src) {
		const node = super.create(src)
		if (src === true) return node

		const image = document.createElement('video')
		node.setAttribute('controls', true)
		node.setAttribute('src', src)
		node.appendChild(image)
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

LoadingVideo.blotName = 'video'
LoadingVideo.tagName = 'video'

export default LoadingVideo
