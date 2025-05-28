import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const glob = require('glob')

//console.log('Current working directory:', process.cwd())
const selectionFilePath =
	'../../node_modules/@sutekitechid/sicoco-v3-next/dist/assets/icomoon/selection.json'

if (!fs.existsSync(selectionFilePath)) {
	console.error('selection.json not found at:', selectionFilePath)
	process.exit(1)
}

const selectionData = JSON.parse(fs.readFileSync(selectionFilePath, 'utf8'))
const iconNames = selectionData.icons.map((icon) => icon.properties.name)

const scanFilesForIcons = (files, icons) => {
	const usedIcons = new Set()

	files.forEach((file) => {
		const content = fs.readFileSync(file, 'utf8')

		icons.forEach((icon) => {
			const regex = new RegExp(`\\b${icon}\\b`, 'g')
			if (regex.test(content)) {
				usedIcons.add(icon)
			}
		})
	})

	return usedIcons
}

const projectDir = process.cwd()
const outputDir = 'assets/icomoon/selection.json'

glob
	.glob(`${projectDir}/**/*.{vue,js,jsx,ts,tsx,html}`, {
		ignore: [
			'**/node_modules/**',
			'**/.next/**',
			'**/build/**',
			'**/dist/**',
			'**/coverage/**',
		],
	})
	.then((files) => {
		console.log(`Found ${files.length} files`)

		if (files.length === 0) {
			console.log('No files found to scan.')
			return
		}

		const usedIcons = scanFilesForIcons(files, iconNames)
		console.log(`Found ${usedIcons.size} used icons`)

		const unusedIcons = iconNames.filter((icon) => !usedIcons.has(icon))

		if (unusedIcons.length > 0) {
			console.log('Unused icons:', unusedIcons)

			// Filter out unused icons
			selectionData.icons = selectionData.icons.filter((icon) =>
				usedIcons.has(icon.properties.name)
			)

			// Safely filter metadata if it's an array
			if (Array.isArray(selectionData.metadata)) {
				selectionData.metadata = selectionData.metadata.filter((meta) =>
					usedIcons.has(meta.name)
				)
			}

			// Backup original file
			// const backupPath = selectionFilePath.replace(/\.json$/, '.backup.json')
			// fs.writeFileSync(backupPath, JSON.stringify(selectionData, null, 2))
			// console.log(`Backup created at: ${backupPath}`)

			// Overwrite selection.json
			fs.writeFileSync(outputDir, JSON.stringify(selectionData, null, 2))
			console.log(`Updated selection.json saved at: ${outputDir}`)
		} else {
			console.log('No unused icons found. No changes made.')
		}
	})
	.catch((err) => {
		console.error('Error reading files:', err)
	})
