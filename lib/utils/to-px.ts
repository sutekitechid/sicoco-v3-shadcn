const PIXELS_PER_INCH_FALLBACK = 96

// Cached value - computed once on first client-side call using offsetHeight
// to avoid circular dependency with toPX
let _pixelsPerInch: number | null = null

function getPixelsPerInch(): number {
if (typeof document === 'undefined') return PIXELS_PER_INCH_FALLBACK
if (_pixelsPerInch !== null) return _pixelsPerInch
const testDIV = document.createElement('div')
testDIV.style.width = '1in'
testDIV.style.position = 'absolute'
testDIV.style.visibility = 'hidden'
document.body.appendChild(testDIV)
_pixelsPerInch = testDIV.offsetWidth || PIXELS_PER_INCH_FALLBACK
document.body.removeChild(testDIV)
return _pixelsPerInch
}

function parseUnit(str: string): [number, string] {
const num = parseFloat(str)
const unit = str.match(/[\d.\-\+]*\s*(.*)/)?.[1]?.trim() || ''
return [num, unit]
}

export function toPX(str: string | number | null | undefined, element?: Element | Window | Document | null): number | null {
if (!str && str !== 0) return null

if (typeof str === 'number') return str

const strVal = (str + '' || 'px').trim().toLowerCase()

if (typeof document === 'undefined') {
const PIXELS_PER_INCH = PIXELS_PER_INCH_FALLBACK
const parts = parseUnit(strVal)
if (!isNaN(parts[0])) {
    if (parts[1]) {
    const px = toPX(parts[1])
    return typeof px === 'number' ? parts[0] * px : null
    }
    return parts[0]
}
// unit-only strings
switch (strVal) {
    case 'px': return 1
    case 'in': return PIXELS_PER_INCH
    case 'cm': return PIXELS_PER_INCH / 2.54
    case 'mm': return PIXELS_PER_INCH / 25.4
    case 'pt': return PIXELS_PER_INCH / 72
    case 'pc': return PIXELS_PER_INCH / 6
    case 'rem': case 'em': return 16
    case 'ch': return 8
    case 'ex': return 7.15625
}
return null
}

const PIXELS_PER_INCH = getPixelsPerInch()

let el: Element = document.body
if (element && element !== window && element !== document) {
el = element as Element
}

// unit-only strings (no number prefix)
switch (strVal) {
case '%':
    return el.clientHeight / 100
case 'ch':
    return parseFloat(getComputedStyle(el).fontSize) * 0.5
case 'ex':
    return parseFloat(getComputedStyle(el).fontSize) * 0.447
case 'em':
    return parseFloat(getComputedStyle(el).fontSize)
case 'rem':
    return parseFloat(getComputedStyle(document.documentElement).fontSize)
case 'vw':
    return window.innerWidth / 100
case 'vh':
    return window.innerHeight / 100
case 'vmin':
    return Math.min(window.innerWidth, window.innerHeight) / 100
case 'vmax':
    return Math.max(window.innerWidth, window.innerHeight) / 100
case 'in':
    return PIXELS_PER_INCH
case 'cm':
    return PIXELS_PER_INCH / 2.54
case 'mm':
    return PIXELS_PER_INCH / 25.4
case 'pt':
    return PIXELS_PER_INCH / 72
case 'pc':
    return PIXELS_PER_INCH / 6
case 'px':
    return 1
}

// strings with number + unit e.g. "40rem", "1.5em", "128px"
const parts = parseUnit(strVal)
if (!isNaN(parts[0])) {
if (parts[1]) {
    const px = toPX(parts[1], el)
    return typeof px === 'number' ? parts[0] * px : null
} else {
    return parts[0]
}
}

return null
}

export default toPX