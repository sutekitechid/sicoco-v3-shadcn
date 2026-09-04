export type UploadFile = File | string

export interface UploadFileMetadata {
	name?: string
	size?: number
	type?: string
}
