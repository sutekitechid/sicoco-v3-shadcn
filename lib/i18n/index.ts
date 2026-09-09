import { inject, type App, type InjectionKey, type Plugin } from 'vue'

export interface LibraryTranslationParams {
	'common.apply': undefined
	'common.back': undefined
	'common.cancel': undefined
	'common.reset': undefined
	'common.retry': undefined
	'datePicker.clearDate': undefined
	'datePicker.closeDrawer': undefined
	'datePicker.drawerTitle': undefined
	'datePicker.invalidDate': undefined
	'datePicker.invalidRange': undefined
	'datePicker.openCalendar': undefined
	'datePicker.range': undefined
	'dropdown.itemsSelected': undefined
	'dropdown.searchPlaceholder': undefined
	'dropdown.selectAll': undefined
	'pagination.page': undefined
	'pagination.perPage': undefined
	'pagination.perPageOption': { perPage: number | string }
	'pagination.summary': { from: number; to: number; total: number | string }
	'upload.addFile': undefined
	'upload.chooseFile': undefined
	'upload.deleteFile': { name: string }
	'upload.description': { formats: string; size: string }
	'upload.dropzonePrefix': undefined
	'upload.failureDescription': undefined
	'upload.failureTitle': undefined
	'upload.loadingDescription': undefined
	'upload.loadingTitle': undefined
	'upload.replaceFile': undefined
	'upload.viewFile': { name: string }
}

export type LibraryTranslationKey = keyof LibraryTranslationParams

export interface TranslationAdapter {
	t<Key extends LibraryTranslationKey>(
		key: Key,
		params?: LibraryTranslationParams[Key],
	): string
}

export interface ComponentLibraryOptions {
	i18n: TranslationAdapter
}

export const LIBRARY_I18N_KEY: InjectionKey<TranslationAdapter> = Symbol('sicoco-i18n')

export function createComponentLibrary(options: ComponentLibraryOptions): Plugin {
	return {
		install(app: App) {
			app.provide(LIBRARY_I18N_KEY, options.i18n)
		},
	}
}

export function useLibraryI18n(): TranslationAdapter {
	const adapter = inject(LIBRARY_I18N_KEY, null)
	if (adapter) return adapter

	throw new Error(
		'[Sicoco] i18n adapter is not installed. Register createComponentLibrary({ i18n }) with app.use().',
	)
}
