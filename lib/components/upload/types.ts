export type UploadFile = File | string

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'failed'

export interface UploadFileMetadata {
	name?: string
	size?: number
	type?: string
}

export interface UploadItem {
	id: string
	file: UploadFile
	status: UploadStatus
	error?: string
	metadata?: UploadFileMetadata
}
