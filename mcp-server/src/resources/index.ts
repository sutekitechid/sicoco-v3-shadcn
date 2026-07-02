import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { ComponentMeta, SnippetMeta, UtilMeta } from '../types.js'

export interface ResourceDeps {
	components: Record<string, ComponentMeta>
	snippets: Record<string, SnippetMeta>
	utils: Record<string, UtilMeta>
}

export function registerResources(server: McpServer, deps: ResourceDeps): void {
	// component://{name}
	server.resource(
		'component',
		new ResourceTemplate('component://{name}', { list: undefined }),
		async (uri, params) => {
			const name = String(params.name ?? '')
			const component = deps.components[name]
			if (!component) {
				throw new Error(`Component "${name}" not found`)
			}
			return {
				contents: [
					{
						uri: uri.href,
						mimeType: 'application/json',
						text: JSON.stringify(component, null, 2),
					},
				],
			}
		},
	)

	// snippet://{prefix}
	server.resource(
		'snippet',
		new ResourceTemplate('snippet://{prefix}', { list: undefined }),
		async (uri, params) => {
			const prefix = String(params.prefix ?? '')
			const snippet = deps.snippets[prefix]
			if (!snippet) {
				throw new Error(`Snippet "${prefix}" not found`)
			}
			return {
				contents: [
					{
						uri: uri.href,
						mimeType: 'application/json',
						text: JSON.stringify(snippet, null, 2),
					},
				],
			}
		},
	)

	// util://{name}
	server.resource(
		'util',
		new ResourceTemplate('util://{name}', { list: undefined }),
		async (uri, params) => {
			const name = String(params.name ?? '')
			const util = deps.utils[name]
			if (!util) {
				throw new Error(`Util "${name}" not found`)
			}
			return {
				contents: [
					{
						uri: uri.href,
						mimeType: 'application/json',
						text: JSON.stringify(util, null, 2),
					},
				],
			}
		},
	)
}
