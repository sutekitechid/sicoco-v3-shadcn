export const fileTypeCategoryEnum = {
    image: 'image',
    video: 'video',
    audio: 'audio',
    application: 'application',
    text: 'text',
    other: 'other'
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
    mp4: 'ic-mp4-outline.svg',
    mov: 'ic-mov-outline.svg',
    mp3: 'ic-mp3-outline.svg',
    wav: 'ic-wav-outline.svg',
    mpeg: 'ic-mpeg-outline.svg',
    avi: 'ic-avi-outline.svg',
    mkv: 'ic-mkv-outline.svg',
    jpg: 'ic-jpg-outline.svg',
    jpeg: 'ic-jpeg-outline.svg',
    png: 'ic-png-outline.svg',
    gif: 'ic-gif-outline.svg',
    svg: 'ic-svg-outline.svg',
    webp: 'ic-webp-outline.svg',
    pdf: 'ic-pdf-outline.svg',
    doc: 'ic-doc-outline.svg',
    docx: 'ic-docx-outline.svg',
    xls: 'ic-xls-outline.svg',
    xlsx: 'ic-xlsx-outline.svg',
    ppt: 'ic-ppt-outline.svg',
    pptx: 'ic-pptx-outline.svg',
    txt: 'ic-txt-outline.svg',
    csv: 'ic-csv-outline.svg',
    html: 'ic-html-outline.svg',
    css: 'ic-css-outline.svg',
    js: 'ic-js-outline.svg',
    json: 'ic-json-outline.svg',
    zip: 'ic-zip-outline.svg',
    rar: 'ic-rar-outline.svg',
    sql: 'ic-sql-outline.svg',
    java: 'ic-java-outline.svg',
    xml: 'ic-xml-outline.svg',
    exe: 'ic-exe-outline.svg',
    dmg: 'ic-dmg-outline.svg',
    other: 'ic-file-outline.svg',
    image: 'ic-image-outline.svg',
    video: 'ic-video-outline.svg',
    audio: 'ic-audio-outline.svg'
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
export const getFileTypeIcon = (file: File): string => {
    const fileType = getFileType(file) as keyof typeof fileTypeIconEnum
    const iconPath = `../assets/icons/${fileTypeIconEnum[fileType]}`
    return iconPath
}

/**
 * Get human readable file size label
 * @param size 
 * @returns string
 */
export const getFilesizeLabel = (size: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let unitIndex = 0
    while (size > 1023) {
        size /= 1024
        unitIndex++
    }
    return `${size.toFixed(0)}${units[unitIndex]}`
}