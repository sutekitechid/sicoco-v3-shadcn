# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# Snippets Creation (IN PROGRESS)

> ⚠️ **Note:** This guide is intended only for snippets development purposes and will be deleted in the future.

## 📁 Folder Location

All snippets creation are stored in `./snippets` (relative from root):
```bash
./snippets/
  ├── card-example.json
  └── button-example.json
```
Code snippets for your reference is at
```bash
.vscode
  ├── reference.code-snippets
```

## ▶️ Usage

After building each snippet, run the following command to merge all code snippets into a single main file:

```bash
npm run postbuild
```

This command is defined as:
```json
"postbuild": "node ./scripts/merge-snippets.js"
```

Once the build completes, the final merged file will be placed at:
```bash
.vscode/components.code-snippets
```

## ▶️ Usage from consumer project
> ⚠️ Make sure to build your local `sicoco-v3-shadcn` first

In development phase, run from **consumer project**:
```bash
npm install <your sicoco-v3-shadcn directory>/sicoco-v3-shadcn
```

Add on `package.json`:
```json
"postinstall": "node ./node_modules/@sutekitechid/sicoco-v3-next/dist/scripts/copy-snippets.js"
```
Execute 
```bash
npm i
```

Or

Run `postinstall` command:
```bash
npm run postinstall
```

