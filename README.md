# Modernized Chrome Extension Vite Starter

> A [Vite](https://vitejs.dev/) Powered `Modernized Chrome Extension Manifest V3` ([Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/)) Starter Template.

## Features

- ⚡️ **Instant HMR** - use **Vite** on dev (no more refresh!)
- 🥝 Vue 3 - Composition API, [`<script setup>` syntax](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md) and more!
- 💬 [VueUse](https://github.com/antfu/vueuse) storage
- 🦾 [TypeScript](https://www.typescriptlang.org/) - type safe
- 📦 [Components auto importing](./views/components)
- 🌍 [I18N ready](views/locales)
- 📃 Dynamic `manifest.json` with full type support

### Dev tools

- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.js.org/) - fast, disk space efficient package manager
- [tsup](https://github.com/egoist/tsup) - Zero config TypeScript bundler powered by esbuild
- [esno](https://github.com/antfu/esno) - TypeScript / ESNext node runtime powered by esbuild
- [npm-run-all](https://github.com/mysticatea/npm-run-all) - Run multiple npm-scripts in parallel or sequential

### Development

```bash
pnpm dev
```

Then **load extension in browser with the `extension/` folder**,

### Build

To build the extension, run

```bash
pnpm build
```

And then pack files under `extension`.  


[MIT](./LICENSE) - [@xiaoluoboding](https://github.com/xiaoluoboding)
