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
const iconNames = selectionData.icons.map(icon => icon.properties.name)

const scanFilesForIcons = (files, icons) => {
	const usedIcons = new Set()

	files.forEach(file => {
		const stat = fs.statSync(file)
  	if (stat.isDirectory()) return   // ⛔ skip folder

		const content = fs.readFileSync(file, 'utf8')

		icons.forEach(icon => {
			const regex = new RegExp(`\\bsi-${icon}(?![-\\w])`, 'g')
			if (regex.test(content)) {
				usedIcons.add(icon)
			}
		})
	})

	return usedIcons
}

const projectDir = process.cwd()
const packagesDir = path.join(projectDir, '..', '..', 'packages')
const sicocoV3NextDir = path.join(
	projectDir,
	'..',
	'..',
	'node_modules',
	'@sutekitechid',
	'sicoco-v3-next',
	'dist'
)

const outputDir = path.join(projectDir, 'assets/icomoon')
const outputPath = path.join(outputDir, 'selection.json')

// ✅ Create the directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true })
}

const globOptions = {
	ignore: [
		'**/node_modules/**',
		'**/.next/**',
		'**/build/**',
		'**/dist/**',
		'**/coverage/**',
	],
	nodir: true,
}

// Scan both project and packages directories
const projectFiles = glob.sync(
	`${projectDir}/**/*.{vue,js,jsx,ts,tsx,html}`,
	globOptions
)
const packageFiles = glob.sync(
	`${packagesDir}/**/*.{vue,js,jsx,ts,tsx,html}`,
	globOptions
)
const sicocoV3NextFiles = glob.sync(`${sicocoV3NextDir}/**/*.js`)

const allFiles = [...projectFiles, ...packageFiles, ...sicocoV3NextFiles]
console.log(`Found ${allFiles.length} files`)

if (allFiles.length === 0) {
	console.log('No files found to scan.')
} else {
	const usedIcons = scanFilesForIcons(allFiles, iconNames)
	console.log(`Found ${usedIcons.size} used icons`)

	const unusedIcons = iconNames.filter(icon => !usedIcons.has(icon))

	if (unusedIcons.length > 0) {
		// Filter out unused icons
		selectionData.icons = selectionData.icons.filter(icon =>
			usedIcons.has(icon.properties.name)
		)

		// Filter metadata if it's an array
		if (Array.isArray(selectionData.metadata)) {
			selectionData.metadata = selectionData.metadata.filter(meta =>
				usedIcons.has(meta.name)
			)
		}

		fs.writeFileSync(outputPath, JSON.stringify(selectionData, null, 2))
		console.log(`Updated selection.json saved at: ${outputPath}`)
	} else {
		console.log('No unused icons found. No changes made.')
	}
}
