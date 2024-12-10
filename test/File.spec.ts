import { test, expect } from 'vitest'
import { getFileType, getFileTypeIcon, getFilesizeLabel } from '../lib/utils/file'

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
    expect(getFileTypeIcon(file)).toContain('ic-jpg-outline.svg')
    file = new File([''], 'test.pdf', { type: 'application/pdf' })
    expect(getFileTypeIcon(file)).toContain('ic-pdf-outline.svg')
    file = new File([''], 'test.zip', { type: 'application/zip' })
    expect(getFileTypeIcon(file)).toContain('ic-zip-outline.svg')
})

test('getFilesizeLabel should return file size label', () => {
    expect(getFilesizeLabel(1024)).toBe('1KB')
    expect(getFilesizeLabel(1024 * 1024)).toBe('1MB')
    expect(getFilesizeLabel(1024 * 1024 * 1024)).toBe('1GB')
    expect(getFilesizeLabel(1024 * 1024 * 1024 * 1024)).toBe('1TB')
})