import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import ClipperLib from 'clipper-lib'
import svgpath from 'svgpath'

//#region selection.json to svg font
// Paths and configuration
const projectRoot = process.cwd()
const selectionPath = 'assets/icomoon/selection.json'

const fontName = 'suteki-icon'

// Read selection.json
const selection = JSON.parse(fs.readFileSync(selectionPath, 'utf-8'))
const icons = selection.glyphs

const VIEWBOX = 24
const FONT_SIZE = 1024
const SCALE = FONT_SIZE / VIEWBOX
const CLIPPER_SCALE = 10_000

function pointToD([x, y]) {
	return `${x * SCALE} ${y * SCALE}`
}

function getCommandEnd(cmd) {
	if (cmd.tag === 'LineTo') return cmd.args[0].point
	if (cmd.tag === 'BezierCurveTo') return cmd.args[0].args[0].end
	return null
}

function sampleSubpath(subpath, curveSegments = 8) {
	const points = [subpath.start]
	let previous = subpath.start

	for (const cmd of subpath.cmds || []) {
		if (cmd.tag === 'LineTo') {
			previous = cmd.args[0].point
			points.push(previous)
			continue
		}

		if (cmd.tag !== 'BezierCurveTo') continue

		const { c1, c2, end } = cmd.args[0].args[0]
		for (let index = 1; index <= curveSegments; index++) {
			const t = index / curveSegments
			const inverseT = 1 - t
			points.push([
				inverseT ** 3 * previous[0] + 3 * inverseT ** 2 * t * c1[0] + 3 * inverseT * t ** 2 * c2[0] + t ** 3 * end[0],
				inverseT ** 3 * previous[1] + 3 * inverseT ** 2 * t * c1[1] + 3 * inverseT * t ** 2 * c2[1] + t ** 3 * end[1],
			])
		}
		previous = end
	}

	return points
}

function isPointInsidePolygon([x, y], polygon) {
	let inside = false

	for (let index = 0, previousIndex = polygon.length - 1; index < polygon.length; previousIndex = index++) {
		const [currentX, currentY] = polygon[index]
		const [previousX, previousY] = polygon[previousIndex]
		const crossesRay = (currentY > y) !== (previousY > y)

		if (crossesRay && x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX) {
			inside = !inside
		}
	}

	return inside
}

function getSignedArea(polygon) {
	return polygon.reduce((area, point, index) => {
		const previousPoint = polygon.at(index - 1)
		return area + previousPoint[0] * point[1] - point[0] * previousPoint[1]
	}, 0) / 2
}

function getEvenOddDirection(subpath, paths) {
	const containers = paths.filter(candidate => {
		return candidate !== subpath && isPointInsidePolygon(subpath.start, sampleSubpath(candidate))
	})
	const root = containers.reduce((largest, candidate) => {
		const candidateArea = Math.abs(getSignedArea(sampleSubpath(candidate)))
		const largestArea = Math.abs(getSignedArea(sampleSubpath(largest)))
		return candidateArea > largestArea ? candidate : largest
	}, subpath)
	const rootDirection = Math.sign(getSignedArea(sampleSubpath(root)))

	return containers.length % 2 === 0 ? rootDirection : -rootDirection
}

function pathObjectToD(paths, fillRule) {
	return paths
		.map(subpath => {
			const direction = Math.sign(getSignedArea(sampleSubpath(subpath)))
			const targetDirection = fillRule === 'EvenOdd' ? getEvenOddDirection(subpath, paths) : direction
			const reverse = direction !== 0 && direction !== targetDirection
			const commands = subpath.cmds || []
			const lastPoint = commands.reduce((point, cmd) => getCommandEnd(cmd) || point, subpath.start)
			let d = `M${pointToD(reverse ? lastPoint : subpath.start)}`

			for (let index = 0; index < commands.length; index++) {
				const commandIndex = reverse ? commands.length - index - 1 : index
				const cmd = commands[commandIndex]
				const start = commands
					.slice(0, commandIndex)
					.reduce((point, previousCmd) => getCommandEnd(previousCmd) || point, subpath.start)

				if (cmd.tag === 'LineTo') {
					d += `L${pointToD(reverse ? start : cmd.args[0].point)}`
					continue
				}

				if (cmd.tag !== 'BezierCurveTo') continue

				const { c1, c2, end } = cmd.args[0].args[0]
				d += reverse
					? `C${pointToD(c2)} ${pointToD(c1)} ${pointToD(start)}`
					: `C${pointToD(c1)} ${pointToD(c2)} ${pointToD(end)}`
			}

			if (subpath.endings?.tag === 'Connected') d += 'Z'
			return d
		})
		.join('')
}

function getRenderableElements(node, insideDefinition = false, elements = []) {
	if (node?.tag !== 'Element') return elements

	const element = node.args?.[0]
	const isDefinition = insideDefinition || ['defs', 'clipPath', 'mask'].includes(element?.tagName)
	if (!isDefinition && ['path', 'rect'].includes(element?.tagName)) elements.push(element)

	for (const child of element?.children || []) {
		getRenderableElements(child, isDefinition, elements)
	}

	return elements
}

function getNumberAttribute(attribute, fallback = 0) {
	if (!attribute) return fallback
	if (attribute.tag === 'StringValue') return Number(attribute.args[0])
	if (attribute.tag !== 'Value') return fallback

	const value = attribute.args?.[0]
	if (value?.tag !== 'Length') return fallback
	return value.args?.[0]?.args?.[0] ?? fallback
}

function rectToD(attributes) {
	const x = getNumberAttribute(attributes.x)
	const y = getNumberAttribute(attributes.y)
	const width = getNumberAttribute(attributes.width)
	const height = getNumberAttribute(attributes.height)

	return `M${pointToD([x, y])}L${pointToD([x + width, y])}L${pointToD([x + width, y + height])}L${pointToD([x, y + height])}Z`
}

function getStrokeValue(attribute) {
	return attribute?.args?.[0]?.args?.[0]?.tag
}

function pointsAreEqual(first, second) {
	return first[0] === second[0] && first[1] === second[1]
}

function strokePathObjectToD(paths, attributes) {
	const strokeWidth = getNumberAttribute(attributes['stroke-width'])
	const lineCap = getStrokeValue(attributes['stroke-linecap'])
	const lineJoin = getStrokeValue(attributes['stroke-linejoin'])
	const joinType = lineJoin === 'RoundJoin' ? ClipperLib.JoinType.jtRound : ClipperLib.JoinType.jtMiter
	const offset = new ClipperLib.ClipperOffset(2, CLIPPER_SCALE / 4)

	for (const subpath of paths) {
		const points = sampleSubpath(subpath, 16)
		if (points.length > 1 && pointsAreEqual(points[0], points.at(-1))) points.pop()
		if (points.length < 2) continue

		const clipperPath = points.map(([x, y]) => ({ X: Math.round(x * CLIPPER_SCALE), Y: Math.round(y * CLIPPER_SCALE) }))
		const endType = subpath.endings?.tag === 'Connected'
			? ClipperLib.EndType.etClosedLine
			: lineCap === 'RoundCap'
				? ClipperLib.EndType.etOpenRound
				: ClipperLib.EndType.etOpenButt
		offset.AddPath(clipperPath, joinType, endType)
	}

	const outlinedPaths = new ClipperLib.Paths()
	offset.Execute(outlinedPaths, (strokeWidth * CLIPPER_SCALE) / 2)
	return outlinedPaths
		.map(outlinedPath => {
			const [firstPoint, ...points] = outlinedPath
			return `M${pointToD([firstPoint.X / CLIPPER_SCALE, firstPoint.Y / CLIPPER_SCALE])}${points
				.map(point => `L${pointToD([point.X / CLIPPER_SCALE, point.Y / CLIPPER_SCALE])}`)
				.join('')}Z`
		})
		.join('')
}

const extractD = (glyph) => {
	return getRenderableElements(glyph.node)
		.map(element => {
			if (element.tagName === 'rect') return rectToD(element.attributes)

			const dAttr = element.attributes.d
			if (!dAttr) return ''
			if (dAttr.tag === 'StringValue') return dAttr.args[0]
			if (dAttr.tag === 'Value') {
				const paths = dAttr.args?.[0]?.args?.[0]
				if (element.attributes.stroke) return Array.isArray(paths) ? strokePathObjectToD(paths, element.attributes) : ''
				const fillRule = element.attributes['fill-rule']?.args?.[0]?.args?.[0]?.tag
				return Array.isArray(paths) ? pathObjectToD(paths, fillRule) : ''
			}
			return ''
		})
		.join('')
}

// Header for each SVG file (shared font structure)
let svgContent =
	`<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
<svg xmlns="http://www.w3.org/2000/svg">
<metadata>Generated by IcoMoon</metadata>
<defs>
<font id="suteki-icon" horiz-adv-x="1024">
<font-face units-per-em="1024" ascent="960" descent="-64" />
<missing-glyph horiz-adv-x="1024" />
<glyph unicode="&#x20;" horiz-adv-x="512" d="" />`.trim() + '\n'

console.log('\nGenerating SVG font...')

// Generate individual SVG files for each icon
icons.forEach((icon) => {
  const name = icon.extras.name
  const d = extractD(icon)
  const unicode = icon.extras.codePoint.toString(16)

  if (!d) throw new Error(`No renderable path found for glyph: ${name}`)

  const glyphContent = `<glyph unicode="&#x${unicode};" glyph-name="${name}" d="${d}" />`.trim()

  svgContent += glyphContent + '\n'
})

svgContent += `</font></defs></svg>`

svgContent = svgContent.replace(
	/(<glyph[^>]*d=")([^"]+)(")/g,
	(_, start, d, end) => {
		const flippedPath = svgpath(d).scale(1, -1).translate(0, 975).toString()
		return `${start}${flippedPath}${end}`
	}
)

const outputDir = 'assets/icomoon/svg'

deleteFileOnFolder(outputDir)

const outputPath = path.join(outputDir, `${fontName}.svg`)
fs.writeFileSync(outputPath, svgContent)

console.log(`✅ SVG font generated at ${outputPath}`)
//#endregion

//#region Convert SVG font to Ttf
const fontOutputFolder = 'assets/icomoon/ttf'

deleteFileOnFolder(fontOutputFolder)

const ttfPath = path.join(fontOutputFolder, `${fontName}.ttf`)
const svgSource = path.join(outputDir, `${fontName}.svg`)
console.log('\nGenerating TTF...')

try {
	execFileSync(
		process.execPath,
		[path.join(projectRoot, 'node_modules/svg2ttf/svg2ttf.js'), svgSource, ttfPath],
		{ stdio: 'inherit' }
	)
	console.log(`✅ Ttf generated at ${ttfPath}`)
} catch (error) {
	console.error('❌ Failed to generate Ttf:', error.message)
}
//#endregion

//#region Convert Ttf to Woff
const woffOutputFolder = 'assets/icomoon/woff'

deleteFileOnFolder(woffOutputFolder)

const woffPath = path.join(woffOutputFolder, `${fontName}.woff`)
console.log('\nGenerating WOFF...')

try {
	execFileSync(
		process.execPath,
		[path.join(projectRoot, 'node_modules/ttf2woff/ttf2woff.js'), ttfPath, woffPath],
		{ stdio: 'inherit' }
	)
	console.log(`✅ Woff generated at ${woffPath}`)
} catch (error) {
	console.error('❌ Failed to generate WOFF:', error.message)
}
//#endregion

function deleteFileOnFolder(dir) {
	if (fs.existsSync(dir)) {
		for (const file of fs.readdirSync(dir)) {
			const filePath = path.join(dir, file)
			if (fs.lstatSync(filePath).isFile()) {
				fs.unlinkSync(filePath)
			}
		}
	} else {
		fs.mkdirSync(dir, { recursive: true })
	}
}
