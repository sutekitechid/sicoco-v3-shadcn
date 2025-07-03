import sanitizeHtml from 'sanitize-html'

const overridenOptions = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat([
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'ol',
		'ul',
		'li',
		'img',
		'iframe',
		'figure',
		'figcaption',
		'oembed',
		'video',
		'audio',
		'blockquote',
		'a',
		'pre',
	]),
	transformTags: {
		ol: sanitizeHtml.simpleTransform('ol', {
			class: 'list-decimal list-inside',
		}),
		ul: sanitizeHtml.simpleTransform('ul', { class: 'list-disc list-inside' }),
		li: sanitizeHtml.simpleTransform('li', {
			class: 'my-0.5',
		}),
		figure: sanitizeHtml.simpleTransform('figure'),
		oembed: (tagName: string, attribs: unknown) => {
			return {
				tagName: 'iframe',
				attribs: {
					...attribs,
					src: getEmbedUrl(attribs.url),
					class: 'w-full lg:w-[37.5rem] lg:h-[25rem]',
					frameborder: 0,
					allowfullscreen: true,
					allow:
						'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
				},
			}
		},
		p: (tagName: string, attribs: unknown) => {
			const alignmentClasses = [
				'ql-align-center',
				'ql-align-right',
				'ql-align-justify',
			]
			const classList = attribs.class?.split(' ') || []
			const filteredClasses = classList.filter((cls: string) =>
				alignmentClasses.includes(cls)
			)
			const tailwindClasses = filteredClasses.map((cls: string) => {
				switch (cls) {
					case 'ql-align-center':
						return 'text-center'
					case 'ql-align-right':
						return 'text-right'
					case 'ql-align-justify':
						return 'text-justify'
					default:
						return ''
				}
			})
			const defaultClasses = ['text-sm', 'my-2']
			const mergedClasses = [...defaultClasses, ...tailwindClasses]
			return {
				tagName: 'p',
				attribs: {
					...attribs,
					class: mergedClasses.join(' '),
				},
			}
		},
		table: sanitizeHtml.simpleTransform('table', {
			class: '!border-collapse border border-neutral-50',
		}),
		th: sanitizeHtml.simpleTransform('th', {
			class: 'border border-black font-semibold px-2 py-1',
		}),
		td: sanitizeHtml.simpleTransform('td', {
			class: 'border border-black px-2 py-1 break-all',
		}),
		blockquote: sanitizeHtml.simpleTransform('blockquote', {
			class: 'italic border-l-4 border-neutral-30 pl-4 text-neutral-90',
		}),
		h1: sanitizeHtml.simpleTransform('h1', {
			class: 'text-3xl font-bold my-2',
		}),
		h2: sanitizeHtml.simpleTransform('h2', {
			class: 'text-2xl font-bold my-1.5',
		}),
		h3: sanitizeHtml.simpleTransform('h3', {
			class: 'text-xl font-bold my-1',
		}),
		h4: sanitizeHtml.simpleTransform('h4', {
			class: 'text-lg font-bold my-1',
		}),
		h5: sanitizeHtml.simpleTransform('h5', {
			class: 'text-base font-bold my-0.5',
		}),
		h6: sanitizeHtml.simpleTransform('h6', {
			class: 'text-sm font-bold my-0.5',
		}),
		a: sanitizeHtml.simpleTransform('a', {
			class: 'text-primary-50 hover:text-primary-70 underline',
			target: '_blank',
			rel: 'noopener noreferrer',
		}),
		pre: sanitizeHtml.simpleTransform('pre', {
			class:
				'overflow-x-auto bg-neutral-100 py-[0.1rem] my-2 px-2 rounded text-white',
		}),
	},
	allowedAttributes: {
		...sanitizeHtml.defaults.allowedAttributes,
		'*': ['class', 'style'],
		iframe: [
			'src',
			'width',
			'height',
			'frameborder',
			'allow',
			'allowfullscreen',
			'class',
			'style',
		],
		video: ['src', 'controls', 'preload'],
		audio: ['src', 'controls', 'preload'],
	},
	allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(['data']),
	allowedIframeHostnames: ['www.youtube.com', 'drive.google.com'],
}

export function useSanitizeHtml(html: string, options?: unknown) {
	return sanitizeHtml(html, options || overridenOptions)
}

function getEmbedUrl(url: string) {
	const videoId = getVideoIdFromUrl(url)
	return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

function getVideoIdFromUrl(url: string) {
	const regex =
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g
	const match = regex.exec(url)
	return match ? match[1] : null
}

export { sanitizeHtml }
