/**
 * Frontend Security Check Script
 * Based on OWASP Top 10 Web Application Security Risks 2025
 *
 * This script performs automated security checks on frontend code (JS/TS/Vue)
 * to detect common vulnerabilities and provide remediation guidance.
 *
 * Usage:
 * - Manual: node security-check.js <files...>
 * - Via lint-staged: Automatically runs on git commit
 *
 * @license MIT
 * @version 1.0.0
 * @see https://owasp.org/www-project-top-ten/
 */

import fs from 'fs'
import path from 'path'

// Console colors for better readability
const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
}

console.log('🛡️  Starting frontend security checks...')

/**
 * Security patterns based on OWASP Top 10 2025
 * Each pattern includes:
 * - Regular expression to detect vulnerable code
 * - Warning message describing the risk
 * - Recommended fix
 * - Reference to OWASP documentation
 */
const patterns = [
	// 1. Cross-Site Scripting (XSS)
	// Risk: Injection of malicious scripts into web pages
	// Impact: Data theft, session hijacking, defacement
	{
		pattern: /v-html\s*=\s*["'][^"']*["']/,
		message: 'XSS: Use of v-html detected',
		fix: 'Replace v-html with {{ }} interpolation or v-text',
		severity: 'HIGH',
		ref: 'https://owasp.org/www-community/attacks/xss/',
	},
	{
		pattern: /innerHTML\s*=/,
		message: 'XSS: Use of innerHTML detected',
		fix: 'Use textContent or safer alternatives',
		severity: 'HIGH',
		ref: 'https://owasp.org/www-community/attacks/xss/',
	},
	{
		pattern: /document\.write\s*\(/,
		message: 'XSS: Use of document(dot.)write() detected',
		fix: 'Use safer DOM manipulation methods',
		severity: 'HIGH',
		ref: 'https://owasp.org/www-community/attacks/xss/',
	},

	// 2. Insecure Design
	// Risk: Architectural flaws in security controls
	{
		pattern: /\blogin\s*\([^)]*\)/,
		message: 'Insecure Design: Login without rate limiting',
		fix: 'Implement rate limiting and brute force protection',
		severity: 'MEDIUM',
		ref: 'https://owasp.org/Top10/A04_2021-Insecure_Design/',
	},

	// 3. Broken Access Control
	// Risk: Unauthorized access to functionality/data
	{
		pattern: /fetch\([`'"]\/api\/user\/\$\{.*\}[`'"]\)/,
		message: 'Broken Access Control: Unvalidated API access',
		fix: 'Implement proper authorization checks',
		severity: 'HIGH',
		ref: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/',
	},

	// 4. Security Misconfigurations
	// Risk: Insecure default configurations, incomplete configurations
	{
		pattern: /cors\(\{[^}]*origin:\s*['"]\*['"][^}]*\}\)/,
		message: 'Security Misconfiguration: CORS wildcard origin',
		fix: 'Restrict CORS to specific origins',
		severity: 'MEDIUM',
		ref: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/',
	},

	// 5. Cryptographic Failures
	// Risk: Failed protection of sensitive data
	{
		pattern: /['"]http:\/\//,
		message: 'Cryptographic Failure: Non-HTTPS usage',
		fix: 'Use HTTPS for all requests',
		severity: 'HIGH',
		ref: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/',
	},
	{
		pattern: /localStorage\.setItem\(['"]password['"],/,
		message: 'Cryptographic Failure: Password in localStorage',
		fix: 'Use secure session management',
		severity: 'CRITICAL',
		ref: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/',
	},

	// 6. Vulnerable Components
	// Risk: Using components with known vulnerabilities
	{
		pattern: /import\s+.*from\s+['"]next@13\.[45]\.11['"]/,
		message: 'Vulnerable Component: Outdated Next.js',
		fix: 'Update Next.js to >=14.1.1',
		severity: 'HIGH',
		ref: 'https://github.com/advisories/GHSA-fr5h-rqp8-mj6g',
	},

	// 7. ID/Auth Failures
	// Risk: Authentication mechanism weaknesses
	{
		pattern: /localStorage\.setItem\(['"]token['"],/,
		message: 'Auth Failure: Token in localStorage',
		fix: 'Use httpOnly cookies for auth tokens',
		severity: 'HIGH',
		ref: 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/',
	},

	// 8. Software Integrity Failures
	// Risk: Running untrusted code/updates
	{
		pattern: /<script\s+src=["'][^"']+["']>/,
		message: 'Integrity Failure: Script without SRI',
		fix: 'Add integrity hash to external scripts',
		severity: 'MEDIUM',
		ref: 'https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/',
	},

	// 9. AI-Powered Threats
	// Risk: AI-based attacks and vulnerabilities
	{
		pattern: /\b(import\s+.*from\s+['"](?:openai|gpt)['"]|require\(['"](?:openai|gpt)['"]\)|\bopenai\.|\bgpt\.|ai\.predict\s*\()/,
		message: 'AI Security: AI API usage detected',
		fix: 'Implement abuse detection and user education',
		severity: 'INFO',
		ref: 'https://owasp.org/www-community/AI_Security/',
	},

	// 10. SSRF
	// Risk: Server-side request forgery via frontend
	{
		pattern: /fetch\(['"]http:\/\/[^'"]+['"]\)/,
		message: 'SSRF: Potential server-side request forgery',
		fix: 'Validate and sanitize all URLs',
		severity: 'HIGH',
		ref: 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_(SSRF)/',
	},
]

let issues = []
let files = []

// Get all files from arguments (lint-staged will pass committed files)
// const files = process.argv.slice(2).filter(f => f.match(/\.(js|ts|vue)$/) && fs.existsSync(f))

/**
 * Get all files recursively from project
 * @param {string} dirPath - Directory path to scan
 * @returns {string[]} Array of file paths
 * uncomment to enable full project scan
 */

if (process.argv.includes('--all')) {
	const getAllFiles = (dirPath, arrayOfFiles = []) => {
		const files = fs.readdirSync(dirPath)

		// Directories to ignore
		const ignoreDirs = [
			'node_modules',
			'.git',
			'dist',
			'.next',
			'build',
			'coverage',
			'.nuxt',
		]

		files.forEach((file) => {
			const fullPath = path.join(dirPath, file)

			if (fs.statSync(fullPath).isDirectory()) {
				// Skip ignored directories
				if (!ignoreDirs.some(dir => fullPath.includes(dir))) {
					arrayOfFiles = getAllFiles(fullPath, arrayOfFiles)
				}
			}
			else {
				// Only scan JS, TS, and Vue files
				if (fullPath.match(/\.(js|ts|vue)$/)) {
					arrayOfFiles.push(fullPath)
				}
			}
		})

		return arrayOfFiles
	}

	// Replace existing files constant with:
	console.log('🔍 Starting project-wide security scan...')

	files = getAllFiles(process.cwd())
	console.log(`📁 Found ${files.length} files to scan\n`)
}
else {
	files = process.argv.slice(2).filter(f => f.match(/\.(js|ts|vue)$/) && fs.existsSync(f))
}
// Scan each file for security issues
for (const file of files) {
	const content = fs.readFileSync(file, 'utf8')
	const lines = content.split('\n')

	lines.forEach((line, idx) => {
		for (const { pattern, message, fix, severity, ref } of patterns) {
			if (pattern.test(line)) {
				const trimmed = line.trim()
				let sanitized = false

				// Check current and nearby lines for sanitization patterns
				const range = 3 // Check 3 lines before and after
				const nearbyLines = []

				// Get previous lines
				for (let i = idx - range; i <= idx + range; i++) {
					if (i >= 0 && i < lines.length) {
						nearbyLines.push(lines[i].trim())
					}
				}

				// Check for sanitization patterns
				sanitized = nearbyLines.some((l) => {
					// Check for sanitization comment
					const hasComment = l.includes('<!-- v-html-sanitized -->') || l.includes('// sanitized') || l.includes('/* sanitized */')

					return hasComment
				})

				// Skip if sanitized or is a comment
				if (
					sanitized
					|| trimmed.startsWith('//')
					|| trimmed.startsWith('/*')
					|| trimmed.startsWith('*')
					|| trimmed.startsWith('\'')
					|| trimmed.startsWith('"')
					|| trimmed.startsWith('<!--')
				) {
					continue
				}

				// Add issue only if not sanitized
				if (!sanitized) {
					issues.push({
						file: path.relative(process.cwd(), file),
						line: idx + 1,
						issue: message,
						code: line.trim(),
						fix: fix,
						severity,
						ref,
					})
				}
			}
		}
	})
}

// Generate security report
if (issues.length > 0) {
	console.error('\n🚨 Security Issues Detected:\n')

	// Format issues for better readability
	const severitySymbols = {
		CRITICAL: '🔴 CRITICAL',
		HIGH: '🟡 HIGH',
		MEDIUM: '🔵 MEDIUM',
		LOW: '⚪ LOW',
		INFO: 'ℹ️  INFO',
	}

	// Split data into multiple tables for better readability
	console.error('1️⃣  Main Issues:')
	console.table(issues.sort((a, b) => {
		const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 }
		return severityOrder[a.severity] - severityOrder[b.severity]
	}).map(i => ({
		Severity: severitySymbols[i.severity],
		File: path.basename(i.file),
		Line: i.line,
		Issue: i.issue,
	})))

	console.error('\n2️⃣  Code & Fixes:')
	console.table(issues.map(i => ({
		File: path.basename(i.file),
		Line: i.line,
		Code: i.code,
		Fix: i.fix,
	})))

	console.error('\n3️⃣  References:')
	console.table(issues.map(i => ({
		File: path.basename(i.file),
		Issue: i.issue,
		Reference: i.ref,
	})))

	// Statistics with emoji
	console.error('\n📊 Issues by Severity:')
	const stats = issues.reduce((acc, i) => {
		acc[severitySymbols[i.severity]] = (acc[severitySymbols[i.severity]] || 0) + 1
		return acc
	}, {})

	console.table(Object.entries(stats).map(([severity, count]) => ({
		Level: severity,
		Count: count,
	})))

	console.error(`\n🚨 Total: ${issues.length} security issues found!\n`)
	process.exit(1)
}

console.log(`${colors.green}✅ All security checks passed!${colors.reset}`)
