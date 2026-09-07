import { config } from '@vue/test-utils'
import { createComponentLibrary, type LibraryTranslationParams, type TranslationAdapter } from '../lib/i18n'

const testTranslations: TranslationAdapter = {
	t(key, params) {
		switch (key) {
			case 'common.apply': return 'Terapkan'
			case 'common.back': return 'Kembali'
			case 'common.cancel': return 'Batal'
			case 'common.reset': return 'Reset'
			case 'common.retry': return 'Coba Lagi'
			case 'datePicker.clearDate': return 'Clear date'
			case 'datePicker.closeDrawer': return 'Close drawer'
			case 'datePicker.drawerTitle': return 'Pilih Tanggal'
			case 'datePicker.invalidDate': return 'Tanggal tidak valid'
			case 'datePicker.openCalendar': return 'Open calendar'
			case 'datePicker.range': return 'Rentang'
			case 'dropdown.itemsSelected': return 'items selected'
			case 'dropdown.searchPlaceholder': return 'Search...'
			case 'dropdown.selectAll': return 'Select all'
			case 'pagination.page': return 'Halaman'
			case 'pagination.perPage': return 'Per halaman'
			case 'pagination.perPageOption': return `${(params as LibraryTranslationParams['pagination.perPageOption'])?.perPage} Baris`
			case 'pagination.summary': {
				const summary = params as LibraryTranslationParams['pagination.summary']
				return `Menampilkan ${summary?.from} - ${summary?.to} dari ${summary?.total} data`
			}
			case 'upload.addFile': return 'Tambah Berkas'
			case 'upload.chooseFile': return 'pilih berkas'
			case 'upload.deleteFile': return `Hapus ${(params as LibraryTranslationParams['upload.deleteFile'])?.name}`
			case 'upload.description': {
				const description = params as LibraryTranslationParams['upload.description']
				return `Format: ${description?.formats} dengan maksimal ${description?.size} per berkas`
			}
			case 'upload.dropzonePrefix': return 'Seret atau'
			case 'upload.failureDescription': return 'Ukuran berkas terlalu besar atau format tidak didukung'
			case 'upload.failureTitle': return 'Gagal mengunggah berkas'
			case 'upload.loadingDescription': return 'Mohon tunggu sebentar, sedang memproses berkas Anda.'
			case 'upload.loadingTitle': return 'Mengunggah...'
			case 'upload.replaceFile': return 'Unggah Ulang'
			case 'upload.viewFile': return `Lihat ${(params as LibraryTranslationParams['upload.viewFile'])?.name}`
			default: return key
		}
	},
}

config.global.plugins = [createComponentLibrary({ i18n: testTranslations })]
