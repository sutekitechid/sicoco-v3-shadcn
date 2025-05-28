import fs from 'fs'
import path from 'path'

const cssPath = path.join(process.cwd(), 'assets/icomoon/style.css')

// Read CSS file
let css = fs.readFileSync(cssPath, 'utf-8')

// Replace the src URL
css = css.replace(
	/src:\s*url\(['"]fonts\/(suteki-icon\.woff\?[^'"]+)['"]\)/,
	"src: url('woff/$1')"
)

// Write the modified CSS back
fs.writeFileSync(cssPath, css, 'utf-8')

console.log('✅ Updated font path in style.css')
