import fs from 'fs'
import path from 'path'

console.log('Purging unused icons from IcoMoon style.css...')

const baseDir = path.join(process.cwd(), 'assets/icomoon')
const selectionFilePath = path.join(baseDir, 'selection.json')
const cssPath = path.join(baseDir, 'style.css')

if (!fs.existsSync(selectionFilePath)) {
	console.error('selection.json not found at:', selectionFilePath)
	process.exit(1)
}

if (!fs.existsSync(cssPath)) {
	console.error('style.css not found at:', cssPath)
	process.exit(1)
}

const selectionData = JSON.parse(fs.readFileSync(selectionFilePath, 'utf8'))
const fromSelection = new Map(
	selectionData.glyphs.map(glyph => [
		glyph.extras.name,
		glyph.extras.codePoint.toString(16).padStart(4, '0'),
	])
)

const css = fs.readFileSync(cssPath, 'utf-8')
const rootStart = css.indexOf(':root {')

if (rootStart === -1) {
	console.error('Could not find ":root {" block in style.css')
	process.exit(1)
}

const header = css.slice(0, rootStart)
const rootMatch = css.slice(rootStart).match(/:root\s*\{([\s\S]*?)\}/)

if (!rootMatch) {
	console.error('Could not parse ":root" block in style.css')
	process.exit(1)
}

const sorted = [...fromSelection.entries()].sort((a, b) =>
	a[1].localeCompare(b[1])
)

let output = header + ':root {\n'
for (const [name, unicode] of sorted) {
	output += `    --si-${name}: "\\${unicode}";\n`
}
output += '}\n'

for (const [name] of sorted) {
	output += `.si-${name}:before {\n    content: var(--si-${name});\n}\n`
}

fs.writeFileSync(cssPath, output, 'utf-8')

console.log('✅ Purged unused icons and updated style.css')
