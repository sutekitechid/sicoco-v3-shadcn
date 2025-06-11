import fs from 'fs'
import path from 'path'

console.log('Purging unused icons from IcoMoon style.css...')

const selectionFilePath = path.join(
	process.cwd(),
	'assets/icomoon/selection.json'
)

if (!fs.existsSync(selectionFilePath)) {
	console.error('selection.json not found at:', selectionFilePath)
	process.exit(1)
}

const selectionData = JSON.parse(fs.readFileSync(selectionFilePath, 'utf8'))
const icons = selectionData.icons.map(icon => ({
	name: icon.properties.name,
	unicode: icon.properties.code.toString(16),
}))

const cssPath = path.join(process.cwd(), 'assets/icomoon/style.css')

// Read CSS file
let css = fs.readFileSync(cssPath, 'utf-8')

// Remove all classes from the CSS
css = css.replace(/\.\si-[^{\s]+[^}]*}/g, '')

icons.forEach(icon => {
	// write new class names
	const className = `si-${icon.name}`
	const unicode = icon.unicode
	const unicodeHex = `\\${unicode}`

	// concat new class names
	const newClass = `.${className}:before{content:'${unicodeHex}';}\n`
	css += newClass
})

// Write the modified CSS back
fs.writeFileSync(cssPath, css, 'utf-8')

console.log('✅ Purged unused icons and updated style.css')
