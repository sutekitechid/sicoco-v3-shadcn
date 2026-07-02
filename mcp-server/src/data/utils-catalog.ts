/**
 * Hand-maintained catalog of utility functions exposed by Sicoco.
 *
 * The list is intentionally small and stable: we only include the
 * public utilities that are re-exported from `lib/main.ts` and are
 * intended for consumer use. Internal helpers (like `toPX`,
 * `debounceInput`, `vnode` helpers) are excluded.
 *
 * Each entry follows the `UtilMeta` shape from `src/types.ts`. When
 * you add a new utility to `lib/utils/`, mirror it here so the MCP
 * server can expose it.
 */
import type { UtilMeta } from '../types.js'

export const utilCatalog: UtilMeta[] = [
	// ----------------------------------------------------------------
	// class merging (tw-merge)
	// ----------------------------------------------------------------
	{
		name: 'cn',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'merge',
		description:
			'Merge Tailwind class names. Later classes override earlier ones. The recommended way to combine class strings in Sicoco components.',
		parameters: [
			{
				name: '...inputs',
				type: 'ClassValue[]',
				required: true,
				description: 'Any number of strings, arrays, or objects of class names.',
			},
		],
		returnType: 'string',
		relatedSnippets: ['si-cn'],
	},

	// ----------------------------------------------------------------
	// currency
	// ----------------------------------------------------------------
	{
		name: 'formatCurrency',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'currency',
		description:
			'Format a number or numeric string as a localized currency string (default locale: id-ID, default currency: IDR).',
		parameters: [
			{
				name: 'value',
				type: 'string | number | null | undefined',
				required: true,
				description: 'The amount to format. null/undefined returns an empty string.',
			},
		],
		returnType: 'string',
		relatedSnippets: ['si-formatcurrency'],
	},

	// ----------------------------------------------------------------
	// file
	// ----------------------------------------------------------------
	{
		name: 'checkFileType',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'file',
		description:
			'Check whether a File matches a list of allowed MIME types or extensions.',
		parameters: [
			{
				name: 'file',
				type: 'File | null',
				required: true,
				description: 'The file to check.',
			},
			{
				name: 'allowedTypes',
				type: 'string[] | undefined',
				required: true,
				description: 'Allowed MIME types (e.g. "image/png") or extensions (e.g. "png").',
			},
		],
		returnType: 'boolean',
		relatedSnippets: ['si-filetype'],
	},
	{
		name: 'getFileTypeIcon',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'file',
		description:
			'Get the icon class name (e.g. "si-file-png") for a file, based on its MIME type or extension.',
		parameters: [
			{
				name: 'file',
				type: 'File',
				required: true,
				description: 'The file whose icon to look up.',
			},
			{
				name: 'outlined',
				type: 'boolean',
				required: false,
				default: 'false',
				description: 'If true, return the "outlined" variant of the icon class.',
			},
		],
		returnType: 'string',
		relatedSnippets: ['si-filetypeicon'],
	},
	{
		name: 'getFilesizeLabel',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'file',
		description: 'Format a byte count as a human-readable label (e.g. "1.2 MB").',
		parameters: [
			{
				name: 'size',
				type: 'number',
				required: true,
				description: 'Size in bytes.',
			},
		],
		returnType: 'string',
		relatedSnippets: ['si-filesize'],
	},
	{
		name: 'getFileType',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'file',
		description: 'Get the MIME type of a File object.',
		parameters: [
			{
				name: 'file',
				type: 'File',
				required: true,
				description: 'The file to inspect.',
			},
		],
		returnType: 'string',
		relatedSnippets: [],
	},

	// ----------------------------------------------------------------
	// pagination
	// ----------------------------------------------------------------
	{
		name: 'getTotalPages',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'pagination',
		description:
			'Compute the total number of pages given a total data count and items-per-page value.',
		parameters: [
			{
				name: 'totalData',
				type: 'number',
				required: true,
				description: 'Total number of items.',
			},
			{
				name: 'perPage',
				type: 'number | string',
				required: true,
				description: 'Items per page.',
			},
		],
		returnType: 'number',
		relatedSnippets: ['si-totalpages'],
	},
	{
		name: 'handleInfiniteScroll',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'pagination',
		description:
			'Attach a scroll listener to a container element that calls `loadMoreFn` when the user scrolls near the bottom.',
		parameters: [
			{
				name: 'container',
				type: 'HTMLElement',
				required: true,
				description: 'The scrollable container element.',
			},
			{
				name: 'loadMoreFn',
				type: '() => void',
				required: true,
				description: 'Function called when more data should be loaded.',
			},
		],
		returnType: 'void',
		relatedSnippets: ['si-infinite'],
	},

	// ----------------------------------------------------------------
	// sanitize-html
	// ----------------------------------------------------------------
	{
		name: 'sanitizeHtml',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'sanitize',
		description:
			'Strip dangerous tags and attributes from an HTML string. Use before rendering user-supplied HTML with `v-html`.',
		parameters: [
			{
				name: 'html',
				type: 'string',
				required: true,
				description: 'The HTML string to sanitize.',
			},
			{
				name: 'options',
				type: 'unknown',
				required: false,
				description: 'Optional sanitize-html configuration object.',
			},
		],
		returnType: 'string',
		relatedSnippets: [],
	},
	{
		name: 'useSanitizeHtml',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'sanitize',
		description:
			'Reactive Vue composable: returns a computed string that is the sanitized version of the input HTML, with reactivity.',
		parameters: [
			{
				name: 'html',
				type: 'string',
				required: true,
				description: 'The reactive HTML string to sanitize.',
			},
			{
				name: 'options',
				type: 'unknown',
				required: false,
				description: 'Optional sanitize-html configuration object.',
			},
		],
		returnType: 'string',
		relatedSnippets: [],
	},
]

/** Lookup map keyed by util name. */
export const utilByName: Map<string, UtilMeta> = new Map(
	utilCatalog.map((u) => [u.name, u] as const),
)

/** Lookup map keyed by util category. */
export const utilsByCategory: Map<string, UtilMeta[]> = (() => {
	const map = new Map<string, UtilMeta[]>()
	for (const u of utilCatalog) {
		const list = map.get(u.category) ?? []
		list.push(u)
		map.set(u.category, list)
	}
	return map
})()
