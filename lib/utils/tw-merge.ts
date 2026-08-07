import { ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customFontSize = [
	'display-xl',
	'display-lg',
	'display-md',
	'display-sm',
	'heading-xl',
	'heading-lg',
	'heading-md',
	'heading-sm',
	'title-lg',
	'title-md',
	'title-sm',
	'body-lg',
	'body-md',
	'body-sm',
	'label-lg',
	'label-md',
	'label-sm',
	'caption-md',
	'caption-sm',
]

const customTwMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			'font-size': [
				{
					text: customFontSize,
				},
			],
		},
	},
})

export function cn(...inputs: ClassValue[]) {
	return customTwMerge(clsx(inputs))
}
