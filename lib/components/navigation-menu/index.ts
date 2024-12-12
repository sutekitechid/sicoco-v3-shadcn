export { default as NavigationMenu } from './NavigationMenu.vue'
export { default as NavItem } from './NavItem.vue'
export { default as NavContainer } from './NavContainer.vue'

export type Option =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<unknown>
  | null
  | undefined
