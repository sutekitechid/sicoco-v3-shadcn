declare module 'sanitize-html' {
	type Attributes = Record<string, unknown>
	type Transform = (tagName: string, attribs: Attributes) => {
		tagName: string
		attribs: Attributes
	}

	const sanitizeHtml: {
		(html: string, options?: unknown): string
		defaults: {
			allowedTags: string[]
			allowedAttributes: Record<string, string[]>
			allowedSchemes: string[]
		}
		simpleTransform(tagName: string, attribs?: Attributes): Transform
	}

	export default sanitizeHtml
}
