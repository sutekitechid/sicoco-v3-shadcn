/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

declare module '*.css' {
  const content: string
  export default content
}

declare module 'quill/dist/quill.core.css'
declare module 'quill/dist/quill.snow.css'
