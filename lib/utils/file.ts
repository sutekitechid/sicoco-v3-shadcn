export const fileTypeCategoryEnum = {
	image: 'image',
	video: 'video',
	audio: 'audio',
	application: 'application',
	text: 'text',
	compressed: 'compressed',
	other: 'other',
}

export const fileTypeEnum = {
	// media
	mp4: 'mp4',
	mov: 'mov',
	mp3: 'mp3',
	wav: 'wav',
	mpeg: 'mpeg',
	avi: 'avi',
	mkv: 'mkv',

	// image
	jpg: 'jpg',
	jpeg: 'jpeg',
	png: 'png',
	gif: 'gif',
	svg: 'svg',
	webp: 'webp',

	// document
	pdf: 'pdf',
	doc: 'doc',
	docx: 'docx',
	xls: 'xls',
	xlsx: 'xlsx',
	ppt: 'ppt',
	pptx: 'pptx',
	txt: 'txt',
	csv: 'csv',

	// web
	html: 'html',
	css: 'css',
	js: 'js',
	json: 'json',

	// compressed
	zip: 'zip',
	rar: 'rar',

	// other
	sql: 'sql',
	java: 'java',
	xml: 'xml',
	exe: 'exe',
	dmg: 'dmg',
}

export const fileTypeIconEnum = {
	mp4: 'ic-mp4.svg',
	'mp4-outline': 'ic-mp4-outline.svg',
	mov: 'ic-mov.svg',
	'mov-outline': 'ic-mov-outline.svg',
	mp3: 'ic-mp3.svg',
	'mp3-outline': 'ic-mp3-outline.svg',
	wav: 'ic-wav.svg',
	'wav-outline': 'ic-wav-outline.svg',
	mpeg: 'ic-mpeg.svg',
	'mpeg-outline': 'ic-mpeg-outline.svg',
	avi: 'ic-avi.svg',
	'avi-outline': 'ic-avi-outline.svg',
	mkv: 'ic-mkv.svg',
	'mkv-outline': 'ic-mkv-outline.svg',
	jpg: 'ic-jpg.svg',
	'jpg-outline': 'ic-jpg-outline.svg',
	jpeg: 'ic-jpeg.svg',
	'jpeg-outline': 'ic-jpeg-outline.svg',
	png: 'ic-png.svg',
	'png-outline': 'ic-png-outline.svg',
	gif: 'ic-gif.svg',
	'gif-outline': 'ic-gif-outline.svg',
	svg: 'ic-svg.svg',
	'svg-outline': 'ic-svg-outline.svg',
	webp: 'ic-webp.svg',
	'webp-outline': 'ic-webp-outline.svg',
	pdf: 'ic-pdf.svg',
	'pdf-outline': 'ic-pdf-outline.svg',
	doc: 'ic-doc.svg',
	'doc-outline': 'ic-doc-outline.svg',
	docx: 'ic-docx.svg',
	'docx-outline': 'ic-docx-outline.svg',
	xls: 'ic-xls.svg',
	'xls-outline': 'ic-xls-outline.svg',
	xlsx: 'ic-xlsx.svg',
	'xlsx-outline': 'ic-xlsx-outline.svg',
	ppt: 'ic-ppt.svg',
	'ppt-outline': 'ic-ppt-outline.svg',
	pptx: 'ic-pptx.svg',
	'pptx-outline': 'ic-pptx-outline.svg',
	txt: 'ic-txt.svg',
	'txt-outline': 'ic-txt-outline.svg',
	csv: 'ic-csv.svg',
	'csv-outline': 'ic-csv-outline.svg',
	html: 'ic-html.svg',
	'html-outline': 'ic-html-outline.svg',
	css: 'ic-css.svg',
	'css-outline': 'ic-css-outline.svg',
	js: 'ic-js.svg',
	'js-outline': 'ic-js-outline.svg',
	json: 'ic-json.svg',
	'json-outline': 'ic-json-outline.svg',
	zip: 'ic-zip.svg',
	'zip-outline': 'ic-zip-outline.svg',
	rar: 'ic-rar.svg',
	'rar-outline': 'ic-rar-outline.svg',
	sql: 'ic-sql.svg',
	'sql-outline': 'ic-sql-outline.svg',
	java: 'ic-java.svg',
	'java-outline': 'ic-java-outline.svg',
	xml: 'ic-xml.svg',
	'xml-outline': 'ic-xml-outline.svg',
	exe: 'ic-exe.svg',
	'exe-outline': 'ic-exe-outline.svg',
	dmg: 'ic-dmg.svg',
	'dmg-outline': 'ic-dmg-outline.svg',
	other: 'ic-file.svg',
	'other-outline': 'ic-file-outline.svg',
	image: 'ic-image.svg',
	'image-outline': 'ic-image-outline.svg',
	video: 'ic-video.svg',
	'video-outline': 'ic-video-outline.svg',
	audio: 'ic-audio.svg',
	'audio-outline': 'ic-audio-outline.svg',
}

export const mimeTypeEnum = {
	// media
	mp4: 'video/mp4',
	mov: 'video/quicktime',
	mp3: 'audio/mpeg',
	wav: 'audio/wav',
	mpeg: 'video/mpeg',
	avi: 'video/x-msvideo',
	mkv: 'video/x-matroska',

	// image
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	gif: 'image/gif',
	svg: 'image/svg+xml',
	webp: 'image/webp',

	// document
	pdf: 'application/pdf',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	xls: 'application/vnd.ms-excel',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	ppt: 'application/vnd.ms-powerpoint',
	pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	txt: 'text/plain',
	csv: 'text/csv',

	// web
	html: 'text/html',
	css: 'text/css',
	js: 'application/javascript',
	json: 'application/json',

	// compressed
	zip: 'application/zip',
	rar: 'application/x-rar-compressed',

	// other
	sql: 'application/sql',
	java: 'application/java-archive',
	xml: 'application/xml',
	exe: 'application/vnd.microsoft.portable-executable',
	dmg: 'application/x-apple-diskimage',
}

/**
 * Get type of file based on extension or mime type. If type is not found, return 'other'
 * @param file
 * @returns string
 */
export const getFileType = (file: File): string => {
	const extension = file?.name?.split('.').pop()
	if (extension) {
		if (Object.values(fileTypeEnum).includes(extension)) {
			return extension
		}
	}

	const type = file?.type?.split('/')[0]
	if (Object.values(fileTypeCategoryEnum).includes(type)) {
		return type
	}

	return fileTypeCategoryEnum.other
}

/**
 * Get icon path based on file type
 * @param file
 * @returns string
 */
const iconMap = import.meta.glob('../assets/icons/*.svg', {
	eager: true,
	import: 'default',
})

export const getFileTypeIcon = (
	file: File,
	outlined: boolean = false
): string => {
	const ext = getFileType(file) as keyof typeof fileTypeIconEnum
	const suffix = outlined ? '-outline' : ''
	const fileName =
		fileTypeIconEnum[`${ext}${suffix}`] || fileTypeIconEnum[`other${suffix}`]
	const fullPath = `../assets/icons/${fileName}`
	return (
		(iconMap[fullPath] as string) ||
		(iconMap[`../assets/icons/${fileTypeIconEnum[`other${suffix}`]}`] as string)
	)
}

/**
 * Get human readable file size label
 * @param size
 * @returns string
 */
export const getFilesizeLabel = (size: number): string => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB']
	let unitIndex = 0
	while (size >= 1024) {
		size /= 1024
		unitIndex++
	}
	return `${size.toFixed(1)}${units[unitIndex]}`
}

export const getFilenameFromUrl = (url: string): string => {
	return url.split('/').pop()?.split(/[?#]/)[0] || url
}

export const checkFileType = (
	file: File | null,
	allowedTypes: string[] | undefined
) => {
	if (!file || !allowedTypes) return true

	if (file.type === '' && file.name.endsWith(`.${fileTypeEnum.rar}`)) {
		return allowedTypes.includes(mimeTypeEnum.rar)
	}

	return allowedTypes.includes(file.type)
}
