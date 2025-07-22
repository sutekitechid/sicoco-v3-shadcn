// scripts/copy-snippets.js
import fs from 'fs'
import path from 'path'

// Path to the source file in your node_modules
const sourceFile = path.join(
	process.cwd(),
	'node_modules/@sutekitechid/sicoco-v3-next/dist/snippets/components.code-snippets'
)

// Path to the destination file in the root .vscode folder
const destinationDir = path.join(process.cwd(), '.vscode')
const destinationFile = path.join(destinationDir, 'components.code-snippets')

// Ensure the .vscode directory exists
if (!fs.existsSync(destinationDir)) {
	fs.mkdirSync(destinationDir, { recursive: true })
}

// Copy the file to the target location
fs.copyFile(sourceFile, destinationFile, (err) => {
	if (err) {
		console.error('❌ Error copying file:', err)
	} else {
		console.log('✅ File copied to .vscode/components.code-snippets')
	}
})
