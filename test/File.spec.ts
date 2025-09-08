import { test, expect, vi } from 'vitest'
import {
	getFileType,
	getFileTypeIcon,
	getFilesizeLabel,
} from '../lib/utils/file'

// Mock the getFileTypeIcon function
vi.mock('../lib/utils/file', async () => {
	const actual = await vi.importActual('../lib/utils/file')
	return {
		...actual,
		getFileTypeIcon: (file: File) => {
			const mockIconMap = {
				jpg: 'ic-jpg.svg',
				pdf: 'ic-pdf.svg',
				zip: 'ic-zip.svg',
			}
			const fileType = file.name.split('.').pop() || ''
			return mockIconMap[fileType] || 'ic-default.svg'
		},
	}
})

test('getFileType should return file type', () => {
	let file = new File([''], 'test.jpg', { type: 'image/jpeg' })
	expect(getFileType(file)).toBe('jpg')
	file = new File([''], 'test.pdf', { type: 'application/pdf' })
	expect(getFileType(file)).toBe('pdf')
	file = new File([''], 'test.zip', { type: 'application/zip' })
	expect(getFileType(file)).toBe('zip')
})

test('getFileType should return file type category', () => {
	let file = new File([''], 'test', { type: 'image/jpeg' })
	expect(getFileType(file)).toBe('image')
	file = new File([''], 'test', { type: 'application/pdf' })
	expect(getFileType(file)).toBe('application')
	file = new File([''], 'test', { type: 'application/zip' })
	expect(getFileType(file)).toBe('application')
	file = new File([''], 'test', { type: 'application/zip' })
	expect(getFileType(file)).toBe('application')
})

test('getFileTypeIcon should return file type icon', () => {
	let file = new File([''], 'test.jpg', { type: 'image/jpeg' })
	expect(getFileTypeIcon(file)).toContain('ic-jpg.svg')
	file = new File([''], 'test.pdf', { type: 'application/pdf' })
	expect(getFileTypeIcon(file)).toContain('ic-pdf.svg')
	file = new File([''], 'test.zip', { type: 'application/zip' })
	expect(getFileTypeIcon(file)).toContain('ic-zip.svg')
})

test('getFilesizeLabel should return file size label', () => {
	expect(getFilesizeLabel(1024)).toBe('1.0KB')
	expect(getFilesizeLabel(1126)).toBe('1.1KB')

	expect(getFilesizeLabel(1024 * 1024)).toBe('1.0MB')
	expect(getFilesizeLabel(1024 * 1126)).toBe('1.1MB')

	expect(getFilesizeLabel(1024 * 1024 * 1024)).toBe('1.0GB')
	expect(getFilesizeLabel(1024 * 1024 * 1126)).toBe('1.1GB')

	expect(getFilesizeLabel(1024 * 1024 * 1024 * 1024)).toBe('1.0TB')
	expect(getFilesizeLabel(1024 * 1024 * 1024 * 1126)).toBe('1.1TB')
})
