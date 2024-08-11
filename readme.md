<h1><img src="https://www.google.com/s2/favicons?sz=64&domain=google.com" /> Userscript Template</h1>

> A template for creating userscripts with TypeScript.

## Installing

- Install Bun and Node
- Install [Violentmonkey](https://violentmonkey.github.io/get-it).
- Install the dependencies: `bun i`
- Run `bun run build` to transpile and bundle the script
- Drag the `dist/index.user.js` file into your browser and click install.

## About this template

- The metadata for the script is completely defined in [`package.json`](package.json).
  - Relevant keys in [`esbuild.ts#L6`](esbuild.ts#L6).
- CSS injection is manual, they'll be imported as a string.
  - There is a `styleInject` function in [`src/util.ts`](src/util.ts) that takes a CSS string and injects a `<style>` tag with the given name as the ID.
  - This is to avoid a duplicate styleInject function definition by esbuild and to provide more manual control.
- The `dev` script will watch for changes and rebuild the script.
- The bundle config is in [`esbuild.ts`](esbuild.ts).
- Build-time variables are declared in [`esbuild.ts#L19`](esbuild.ts#L19) at `esbuildConfig.define` and typed in [`types/window.d.ts`](types/window.d.ts).
- Linting is done with [Biome](https://biomejs.dev).
- Formatting is done with [Prettier](https://prettier.io).
