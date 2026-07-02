import type { Category } from '../types.js'

/**
 * Manual categorization of every exported component.
 *
 * This file is hand-maintained because auto-categorization from folder
 * names is too brittle. Each top-level component should appear in at
 * least one category. Sub-components (e.g. SCardHeader) are typically
 * mapped to the same category as their parent.
 */
export const categories: Record<Category, string[]> = {
	form: [
		'SInput',
		'STextarea',
		'SSWitch',
		'SCheckbox',
		'SCheckboxGroup',
		'SRadioGroup',
		'SRadioGroupItem',
		'SRadioGroupItemLabel',
		'SRadioGroupErrorMessage',
		'SDropdown',
		'SDropdownItem',
		'SDropdownChevron',
		'SDatePicker',
		'STimePicker',
		'SPinInput',
		'SUpload',
		'SUploadFileIcon',
		'SFormInput',
		'SBaseInput',
		'SBaseInputErrorMessage',
	],
	feedback: [
		'SAlert',
		'SAlertDescription',
		'SAlertTitle',
		'SToaster',
		'SProgress',
		'SProgressCircle',
		'SSkeleton',
		'SLoading',
	],
	layout: [
		'SCard',
		'SCardHeader',
		'SCardContent',
		'SCardFooter',
		'SCardTitle',
		'SCardDescription',
		'STable',
		'STableHeader',
		'STableBody',
		'STableHead',
		'STableCell',
		'STableRow',
		'STableFooter',
		'STableEmpty',
		'STabs',
		'STabsList',
		'STabsTrigger',
		'STabsContent',
		'SAccordion',
		'SAccordionItem',
		'SAccordionTrigger',
		'SAccordionContent',
		'SDialog',
		'SDialogContent',
		'SBreadcrumb',
		'SBreadcrumbItem',
		'SSidemenu',
		'SNavigationMenu',
		'SNavigationMenuItem',
	],
	data: [
		'SDataTable',
		'SDataTableColumn',
		'SDataTableGroupColumn',
		'SCalendar',
		'SCalendarHeading',
		'SRangeCalendar',
		'VirtualScroll',
	],
	overlay: ['SDialog', 'SDialogContent', 'STooltip', 'STooltipContent', 'SDropdown'],
	typography: ['SBadge'],
	utility: [
		'SRichTextEditor',
		'SStepper',
		'SStepperItem',
		'SStepperTrigger',
		'SStepperTitle',
		'SStepperDescription',
		'SStepperIndicator',
		'SStepperSeparator',
		'SCarousel',
		'SCarouselContent',
		'SCarouselItem',
		'SCarouselPagination',
		'SCarouselPaginationPrev',
		'SCarouselPaginationNext',
		'SCarouselPaginationDots',
	],
}

/** Lookup: component name -> category. */
export const componentToCategory: Map<string, Category> = new Map(
	Object.entries(categories).flatMap(([cat, names]) =>
		names.map((name) => [name, cat as Category] as const),
	),
)
