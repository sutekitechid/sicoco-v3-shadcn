const PIXELS_PER_INCH_FALLBACK = 96

const defaults: Record<string, number> = {
  ch: 8,
  ex: 7.15625,
  em: 16,
  rem: 16,
  in: PIXELS_PER_INCH_FALLBACK,
  cm: PIXELS_PER_INCH_FALLBACK / 2.54,
  mm: PIXELS_PER_INCH_FALLBACK / 25.4,
  pt: PIXELS_PER_INCH_FALLBACK / 72,
  pc: PIXELS_PER_INCH_FALLBACK / 6,
  px: 1,
}
function parseUnit(str: string): [number, string] {
  const num = parseFloat(str)
  const unit = str.match(/[\d.\-\+]*\s*(.*)/)?.[1] || ''
  return [num, unit]
}

function getPropertyInPX(element: Element, prop: string): number {
  const parts = parseUnit(getComputedStyle(element).getPropertyValue(prop))
  return parts[0] * (toPX(parts[1], element) ?? 0)
}

function getSizeBrutal(unit: string, element: Element): number {
  const testDIV = document.createElement('div')
  testDIV.style.height = '128' + unit
  element.appendChild(testDIV)
  const size = getPropertyInPX(testDIV, 'height') / 128
  element.removeChild(testDIV)
  return size
}

function getPixelsPerInch(): number {
  if (typeof document === 'undefined') return PIXELS_PER_INCH_FALLBACK
  return getSizeBrutal('in', document.body)
}

export function toPX(str: string | number | null | undefined, element?: Element | Window | Document | null): number | null {
  if (!str && str !== 0) return null

  if (typeof document === 'undefined') {
    if (typeof str === 'number') return str
    const parts = parseUnit(String(str))
    if (!isNaN(parts[0])) {
      const unit = parts[1]
      const fallback = defaults[unit]
      if (fallback !== undefined) return parts[0] * fallback
      return parts[0]
    }
    return null
  }

  const PIXELS_PER_INCH = getPixelsPerInch()

  let el: Element = document.body
  if (element && element !== window && element !== document) {
    el = element as Element
  }

  const strVal = ((str as string) + '' || 'px').trim().toLowerCase()

  switch (strVal) {
    case '%':
      return el.clientHeight / 100
    case 'ch':
    case 'ex':
      return getSizeBrutal(strVal, el)
    case 'em':
      return getPropertyInPX(el, 'font-size')
    case 'rem':
      return getPropertyInPX(document.body, 'font-size')
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