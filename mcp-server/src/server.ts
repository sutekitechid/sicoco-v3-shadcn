import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerTools, type ToolDeps } from './tools/index.js'
import { registerResources, type ResourceDeps } from './resources/index.js'

export const SERVER_NAME = 'sicoco-mcp'
export const SERVER_VERSION = '0.1.0'

/**
 * Create a fully wired McpServer instance.
 *
 * Loads the bundled component, snippet, and util registries from disk
 * and registers all tools and resources. The returned server is ready
 * to be connected to a transport (typically stdio).
 */
export function createServer(): McpServer {
	const server = new McpServer({
		name: SERVER_NAME,
		version: SERVER_VERSION,
	})

	const deps: ToolDeps & ResourceDeps = {
		components: {},
		snippets: {},
		utils: {},
	}

	// Lazily load the bundled registries. This is wrapped in a function
	// so that unit tests can inject a custom registry without touching
	// disk.
	function bindRegistries(
		components: ToolDeps['components'],
		snippets: ToolDeps['snippets'],
		utils: ToolDeps['utils'],
	) {
		deps.components = components
		deps.snippets = snippets
		deps.utils = utils
		registerTools(server, deps)
		registerResources(server, deps)
	}

	// Expose a binding hook for the entry script to call after loading
	// registries from disk.
	;(server as unknown as { __bindRegistries: typeof bindRegistries }).__bindRegistries =
		bindRegistries

	return server
}
