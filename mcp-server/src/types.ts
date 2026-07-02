/**
 * Type definitions for the Sicoco MCP server.
 *
 * The MCP server exposes a static, build-time-generated registry of
 * component metadata and code snippets to AI assistants.
 */

/** Top-level categories used to group components in the library. */
export type Category =
	| 'form'
	| 'feedback'
	| 'layout'
	| 'data'
	| 'overlay'
	| 'typography'
	| 'utility'

/** Categories used to group utility functions. */
export type UtilCategory = 'merge' | 'currency' | 'file' | 'pagination' | 'sanitize'

/** Metadata for a single function parameter. */
export interface ParamMeta {
	/** Parameter name. */
	name: string
	/** Resolved type as a string. */
	type: string
	/** Whether the parameter is required. */
	required: boolean
	/** Default value, if known. */
	default?: string
	/** Description, if available. */
	description?: string
}

/** Metadata for a single exported utility function. */
export interface UtilMeta {
	/** Public function name as exported. */
	name: string
	/** Import path consumers should use. */
	importPath: string
	/** Top-level category. */
	category: UtilCategory
	/** Short description. */
	description: string
	/** Function parameters, in declaration order. */
	parameters: ParamMeta[]
	/** Return type as a string. */
	returnType: string
	/** Snippet prefixes that use this util. */
	relatedSnippets: string[]
}

/** Metadata for a single Vue component prop. */
export interface PropMeta {
	/** Prop name as declared in `defineProps<...>()`. */
	name: string
	/** Resolved type as a string (e.g. "string | number"). */
	type: string
	/** Whether the prop is required. */
	required: boolean
	/** Default value as a string, if any. */
	default?: string
	/** Description pulled from JSDoc on the prop, if available. */
	description?: string
}

/** Metadata for a Vue component emitted event. */
export interface EmitMeta {
	/** Event name (e.g. "update:modelValue"). */
	name: string
	/** Payload type as a string, if known. */
	payload?: string
	/** Description pulled from JSDoc, if available. */
	description?: string
}

/** Metadata for a Vue component slot. */
export interface SlotMeta {
	/** Slot name (default slot is "default"). */
	name: string
	/** Scoped-slot binding names (e.g. ["row", "index"]). */
	scope?: string[]
	/** Description pulled from JSDoc, if available. */
	description?: string
}

/** A single cva-style variant. */
export interface VariantMeta {
	/** Variant axis name (e.g. "variant", "size"). */
	name: string
	/** Allowed values for this axis. */
	values: string[]
	/** Default value for this axis, if any. */
	default?: string
}

/** Metadata for a single exported component. */
export interface ComponentMeta {
	/** Public name as exported from `lib/main.ts` (e.g. "SButton"). */
	name: string
	/** Import path consumers should use (e.g. "@sutekitechid/sicoco-v3-next"). */
	importPath: string
	/** Source path within the library (e.g. "lib/components/button/Button.vue"). */
	sourcePath: string
	/** Top-level category. */
	category: Category
	/** Short description of the component. */
	description: string
	/** All declared props. */
	props: PropMeta[]
	/** All declared emits. */
	emits: EmitMeta[]
	/** All declared slots. */
	slots: SlotMeta[]
	/** cva-style variants, if any. */
	variants: VariantMeta[]
	/** Related snippet prefixes that use this component. */
	relatedSnippets: string[]
	/** Whether this component is a sub-component (e.g. SCardHeader vs SCard). */
	isSubComponent: boolean
	/** Parent component name, if this is a sub-component. */
	parent?: string
}

/** Metadata for a single VSCode-style snippet. */
export interface SnippetMeta {
	/** Snippet prefix (e.g. "sibutton:primary"). */
	prefix: string
	/** Human-friendly name shown in IntelliSense. */
	name: string
	/** Short description. */
	description: string
	/** Snippet body, joined into a single string. */
	body: string
	/** Component this snippet is associated with, if any. */
	component?: string
	/** Snippet category for grouping (inferred from prefix). */
	category: string
}

/** Top-level registry structure written to disk at build time. */
export interface ComponentRegistry {
	/** Schema version for forward-compat. */
	version: 1
	/** Library version this registry was generated from. */
	libraryVersion: string
	/** Generated at (ISO 8601 timestamp). */
	generatedAt: string
	/** Component metadata, keyed by component name. */
	components: Record<string, ComponentMeta>
}

/** Snippet registry written to disk at build time. */
export interface SnippetRegistry {
	/** Schema version for forward-compat. */
	version: 1
	/** Library version this registry was generated from. */
	libraryVersion: string
	/** Generated at (ISO 8601 timestamp). */
	generatedAt: string
	/** Snippet metadata, keyed by snippet prefix. */
	snippets: Record<string, SnippetMeta>
}

/** Util registry written to disk at build time. */
export interface UtilRegistry {
	/** Schema version for forward-compat. */
	version: 1
	/** Library version this registry was generated from. */
	libraryVersion: string
	/** Generated at (ISO 8601 timestamp). */
	generatedAt: string
	/** Util metadata, keyed by function name. */
	utils: Record<string, UtilMeta>
}
