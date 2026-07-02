#!/usr/bin/env node
/**
 * MCP server entry point.
 *
 * Boots the server, loads the bundled registries, and connects over
 * stdio. This is what `npx @sutekitechid/sicoco-v3-next-mcp` (and the
 * `sicoco-mcp` bin) ultimately invoke.
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from './server.js'
import {
	loadComponentRegistry,
	loadSnippetRegistry,
	loadUtilRegistry,
} from './data/loader.js'

async function main() {
	const server = createServer()
	const components = loadComponentRegistry()
	const snippets = loadSnippetRegistry()
	const utils = loadUtilRegistry()
	// Bind the loaded registries to the server. We type-erase to `any`
	// here because the `__bindRegistries` hook is attached dynamically
	// to keep the public server API clean.
	const bindable = server as unknown as {
		__bindRegistries: (
			c: typeof components,
			s: typeof snippets,
			u: typeof utils,
		) => void
	}
	bindable.__bindRegistries(components, snippets, utils)

	const transport = new StdioServerTransport()
	await server.connect(transport)

	// Log to stderr so we never pollute stdout (which is the MCP
	// transport channel).
	console.error(
		`[sicoco-mcp] Server ready: ${Object.keys(components).length} components, ${Object.keys(snippets).length} snippets, ${Object.keys(utils).length} utils`,
	)
}

main().catch((err) => {
	console.error('[sicoco-mcp] Fatal error:', err)
	process.exit(1)
})
