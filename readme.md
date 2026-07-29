# Userscript Template

> Opinionated, slim and fast boilerplate for creating userscripts

## Features

- Bundles everything into a single `user.index.js`
- Preloaded with Violentmonkey types
- Serve userscript over HTTP for development
- Inline styles with `loadStyle` compiler macro and `injectStyle` runtime `<style>` tag creator

  ```js
  // transforms this
  injectStyle(loadStyle("styles/main.css"))

  // into this
  injectStyle("*{color:red!important}")
  ```

- Interactive customizer for setup

  ```sh
  ❯ bun run customize

    ┌ userscript-template setup wizard
    │
    ◇ What should the userscript be called?
    │ epic-userscript
    │
    ◇ Describe it.
    │ makes the web more usable
    │

    [...]
  ```

- Automatic userscript metablock generation from package.json fields
- No dependencies, fully utilizing bun's fast toolchain (apart from customizer prompts)
- Opinionated ESLint + ESLint-Stylistic configuration
- Builds quickly on every GitHub push and releases as artifact

## Installing

- Install [bun](https://bun.sh)
- Clone this repo or [generate from template](https://github.com/vaaski/userscript-template/generate)
- Run `bun install`
- Run `bun run customize`

## Usage

The [build script](./build/index.ts) takes two optional flags:

- `--minify`, `-m` to minify the output
- `--watch`, `-w` to watch for changes and rebuild

### Development

- Run `bun run dev`
- Open `http://localhost:3000` in your browser
- Click the userscript link. It should automatically open your userscript manager.

### Production

- Run `bun run build`
- Output should be at `out/index.user.js`

## Examples

- Toggle injected styles with userscript menu item

  ```ts
  import { loadStyle } from "~~/build/styles" with { type: "macro" }
  import { injectStyle } from "~~/userscript/util/inject-style"

  const style = loadStyle("styles/main.css")
  let removeInjection: (() => void) | undefined = injectStyle(style)

  GM.registerMenuCommand(
    "Toggle CSS injection",
    () => {
      if (removeInjection) {
        removeInjection()
        removeInjection = undefined
      } else {
        removeInjection = injectStyle(style)
      }
    },
    {
      icon: "https://www.google.com/s2/favicons?sz=64&domain=google.com",
      autoClose: false,
      title: "Example menu command",
    },
  )
  ```

## See also

- [Spawncamp](https://github.com/vaaski/spawncamp) - my userscript utility toolbox
- [Violentmonkey](https://violentmonkey.github.io)
- [Violentmonkey API Documentation](https://violentmonkey.github.io/api)

## License

GNU GPLv3

<br>

<a href="https://brainmade.org">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://brainmade.org/white-logo.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://brainmade.org/black-logo.svg">
    <img alt="Brainmade.org Logo" src="https://brainmade.org/black-logo.svg">
  </picture>
</a>
