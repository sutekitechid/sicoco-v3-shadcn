import fs from 'fs'
import path from 'path'

const cssPath = path.join(process.cwd(), 'assets/icomoon/style.css')

// Read CSS file
let css = fs.readFileSync(cssPath, 'utf-8')

// Replace embedded or legacy font URLs with the generated WOFF file.
const fontSourcePattern =
	/src:\s*url\(\s*(['"])(?:data:font\/[^'"]+|fonts\/suteki-icon\.woff(?:\?[^'"]+)?)\1\s*\)/

if (!fontSourcePattern.test(css)) {
	console.error('Could not find a supported font src in style.css')
	process.exit(1)
}

css = css.replace(fontSourcePattern, 'src: url("woff/suteki-icon.woff")')

// Write the modified CSS back
fs.writeFileSync(cssPath, css, 'utf-8')

console.log('✅ Updated font path in style.css')
