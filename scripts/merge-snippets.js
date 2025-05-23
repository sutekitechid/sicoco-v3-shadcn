import fs from 'fs'
import path from 'path'

// Path to the root directory where the 'snippets' folder is located
const rootDir = path.join(process.cwd()) // Current working directory (root of your project)

// Path to the snippets folder
const inputDir = path.join(rootDir, 'snippets') // Point to the 'snippets' folder in the root

// Path to the output directory where the merged file will be placed
const outputDir = path.join(rootDir, 'dist/snippets') // Output directory in 'dist/snippets'
const outputFile = path.join(outputDir, 'components.code-snippets')

// Define path to .vscode directory and destination file
const vscodeDir = path.join(rootDir, '.vscode')
const vscodeFile = path.join(vscodeDir, 'components.code-snippets')

// Automatically detect all .json files in the /snippets directory (excluding this script)
const files = fs.readdirSync(inputDir).filter((file) => file.endsWith('.json'))

let mergedSnippets = {}

// Iterate through each .json file and merge its content
files.forEach((file) => {
	const filePath = path.join(inputDir, file)

	try {
		const content = fs.readFileSync(filePath, 'utf8')
		const parsed = JSON.parse(content)
		mergedSnippets = { ...mergedSnippets, ...parsed }
	} catch (err) {
		console.error(`❌ Error parsing ${file}: ${err.message}`)
	}
})

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true })
}

// ✅ Delete existing output file if it exists
if (fs.existsSync(outputFile)) {
	fs.unlinkSync(outputFile)
	console.log(`🗑️ Deleted existing file: ${outputFile}`)
}

// Write the merged snippets to the output file
fs.writeFileSync(outputFile, JSON.stringify(mergedSnippets, null, 2), 'utf8')
console.log(`✅ Merged ${files.length} files into ${outputFile}`)

// Ensure .vscode directory exists
if (!fs.existsSync(vscodeDir)) {
	fs.mkdirSync(vscodeDir, { recursive: true })
}

// Overwrite if the file exists
fs.copyFileSync(outputFile, vscodeFile)
console.log(`📁 Copied (overwritten) to ${vscodeFile}`)
