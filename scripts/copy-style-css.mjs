import fs from 'fs'
import path from 'path'

// Path to the source file in your node_modules
const sourceFile = path.join(
	process.cwd(),
	'../../node_modules/@sutekitechid/sicoco-v3-next/dist/assets/icomoon/style.css'
)

// Path to the destination file
const destinationDir = path.join(process.cwd(), 'assets/icomoon')
const destinationFile = path.join(destinationDir, 'style.css')

// Clear the destination file if it exists
if (fs.existsSync(destinationFile)) {
	fs.unlinkSync(destinationFile)
	console.log(`🗑️  Deleted existing file: ${destinationFile}`)
}

// Copy the file to the target location
fs.copyFile(sourceFile, destinationFile, (err) => {
	if (err) {
		console.error('❌ Error copying file:', err)
	} else {
		console.log('✅ File copied to assets/icomoon/style.css')
	}
})
