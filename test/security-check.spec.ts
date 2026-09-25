import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { expect, test } from 'vitest'

test('accepts a sanitization marker before a multi-line v-html element', () => {
	const directory = mkdtempSync(join(tmpdir(), 'security-check-'))
	const file = join(directory, 'sanitized.vue')

	writeFileSync(file, `<template>
<!-- v-html-sanitized -->
<div
	v-else-if="selectedElement"
	:class="[
		'min-w-0 truncate',
		!isSelected && 'text-placeholder',
	]"
	v-html="sanitizeHtml(selectedElement)"
/>
</template>`)

	try {
		expect(() => execFileSync('node', [resolve('scripts/security-check.js'), file])).not.toThrow()
	}
	finally {
		rmSync(directory, { force: true, recursive: true })
	}
})
