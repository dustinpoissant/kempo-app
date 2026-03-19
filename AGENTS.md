# Kempo App — Copilot Instructions

## Project Overview

**kempo-app** is an installable npm package that provides an Electron desktop app framework built on **kempo-ui** (Lit web components) and **kempo-css**. Consumers `npm install kempo-app`, create a few files in their project root, and run `kempo-app` to launch.

The framework provides: custom protocol, frameless titlebar, hash-based SPA router, flat-file JSON database, and an optional backend hook.

## Consumer Project Structure

A consumer's project looks like this (no `src/` directory needed):

```
my-app/
  package.json       "appName", "appIcon", "protocolName" configure the app
  app.html           App shell fragment — nav bar, #page-container
  pages/
    home.html        Home page fragment (loaded for #/)
    settings.html    Settings page fragment (loaded for #/settings)
  media/             App assets — icon.png goes here
    icon.png         App icon (reference as "appIcon": "media/icon.png" in package.json)
  icons/             Optional — custom SVG icons (searched first by k-icon)
  backend.js         Optional — runs in main process, receives { db, ipc, app, Menu }
  theme.css          Optional — loaded after kempo-css for custom theming
  titlebar.html      Optional — injected before app.html (place app-titlebar here)
  app.js             Optional — ESM module, runs after app.html is injected
```

### Consumer package.json Fields

| Field | Description | Default |
|-------|-------------|---------|
| `appName` | Display name shown in titlebar and window title | `name` field, then `"Kempo App"` |
| `appIcon` | Path to app icon (relative to project root) | none |
| `protocolName` | Custom protocol scheme name | `"kempo-app"` |

## Framework Structure (this repo)

```
bin/
  kempo-app.js       CLI entry point. Sets KEMPO_APP_ROOT=cwd, spawns Electron.
src/
  main/
    main.js          Electron main process. Protocol, IPC, window, backend hook.
    preload.cjs      Exposes window.api. Must be .cjs — Electron preloads cannot use ESM.
    database.js      Flat-file JSON database. Stores to app.getPath('userData').
  renderer/
    index.html       Minimal HTML shell — loads kempo-css, app.css, theme.css, app.js.
    app.js           Fetches app.html, injects shell, runs convention-based router.
    app.css          Framework styles — scrollbar, layout, nav indicator.
    titlebar.js      Custom frameless titlebar (mac + windows/linux).
icons/               Framework SVG icons (window-minimize, window-maximize, etc.).
scripts/
  interact.js        CLI for interacting with the running app via CDP.
example/              Example consumer app for testing the framework.
  package.json       Consumer config (appName, protocolName, deps)
  app.html           Example app shell
  pages/             Example pages
```

## Custom Protocol

All files are served through a custom protocol (default `kempo-app://`). The scheme name is configurable via `"protocolName"` in the consumer's package.json. The framework also automatically calls `app.setAsDefaultProtocolClient(protocolName)`, so the scheme is registered with the OS as a system-wide URL handler — clicking `protocolName://` links will open the app.

Three path zones:
- `/framework/` → kempo-app's `src/` directory (framework files)
- `/modules/` → consumer's `node_modules/` (dependencies)
- Everything else → consumer's project root (app.html, pages/, theme.css, etc.)

## npm Scripts

Consumer's `package.json` should include:
```json
"scripts": {
  "start": "kempo-app",
  "dev": "kempo-app --dev",
  "interact": "kempo-interact"
}
```

| Command | What it does |
|---------|-------------|
| `npm start` | Run the app |
| `npm run dev` | Run with DevTools + CDP on port 9222 + Node inspector on 5858 |
| `npm run interact -- <cmd>` | Interact with the running app (requires dev mode) |

## Interacting With the Running App

When `npm run dev` is running, use `npm run interact` to control the app:

```sh
npm run interact -- structure          # page structure (buttons, inputs, links)
npm run interact -- screenshot         # take a screenshot
npm run interact -- navigate /settings # navigate to a page
npm run interact -- click "#some-id"   # click an element
npm run interact -- click-text "Settings"
npm run interact -- type "#input" "value"
npm run interact -- eval "document.title"
npm run interact -- dom                # full DOM
```

**Always run `structure` or `dom` first** to understand the page before interacting.

## Renderer API (window.api)

Available in any renderer script or page HTML fragment:

```js
// Database (persisted to userData/settings.json)
await window.api.db.get()           // get all settings
await window.api.db.get("key")      // get one value
await window.api.db.set("key", val) // set a value
await window.api.db.delete("key")
await window.api.db.has("key")
await window.api.db.clear()

// Window controls
window.api.window.minimize()
window.api.window.maximize()
window.api.window.close()
window.api.window.new()          // open a new app window
window.api.window.new("#/page")  // open a new window at a specific route

// Notifications
const id = await window.api.notification.show({ title, body, icon, silent, subtitle, urgency, timeoutType })
await window.api.notification.isSupported() // true / false

// Platform
const platform = await window.api.getPlatform() // 'mac' | 'win' | 'linux'
```

## Window Events

The framework dispatches custom events on `window` that any script or component can listen for:

| Event | Fired when | `event.detail` |
|-------|-----------|----------------|
| `settingchange` | `window.api.db.set()` completes | `{ key, value }` |
| `routechange` | Hash-based route changes | `{ path, params }` |
| `notification:click` | User clicks a notification | `{ id }` |
| `notification:close` | Notification is dismissed | `{ id }` |
| `notification:reply` | User submits inline reply (macOS) | `{ id, reply }` |

```js
window.addEventListener("settingchange", e => {
  console.log(e.detail.key, e.detail.value);
});
```

## Router

The router is **convention-based** — no route config needed.

- `#/` → loads `pages/home.html`
- `#/settings` → loads `pages/settings.html`
- `#/any-page` → loads `pages/any-page.html`

Query parameters are supported:
- `#/settings?tab=appearance` → `window.route.params.tab === "appearance"`

`window.route` is always available with `{ path, params }`.

### Adding a New Page

1. Create `pages/my-page.html` as an HTML fragment
2. Add a nav link in `app.html`:
   ```html
   <a href="#/my-page" class="nav-link">My Page</a>
   ```

That's it — no route registration needed.

## backend.js Hook

If a `backend.js` file exists in the consumer's project root, it's dynamically imported at startup. It must export a default function:

```js
export default ({ db, ipc, app, Menu }) => {
  ipc.handle("my-channel", (e, data) => {
    // custom IPC handler
  });
};
```

- `db` — the Database instance (get/set/delete/has/clear)
- `ipc` — Electron's `ipcMain`
- `app` — Electron's `app`

## kempo-ui Components

All components are web components with `k-` prefix. Registered in app.js:
- `k-card` — bordered card with optional label
- `k-toggle` — boolean switch, fires `toggle` event with `event.detail.value`
- `k-theme-switcher` — light/dark/auto mode selector
- `k-icon` — SVG icon (searches consumer `icons/`, then framework `icons/`, then kempo-ui icons)
- `k-import` — loads HTML fragments
- `app-page` — the router's render target; place this where page content should appear (auto-imported by the framework)

Other available components (import from `/modules/kempo-ui/dist/components/`):
`k-accordion`, `k-dialog`, `k-dropdown`, `k-spinner`, `k-tabs`, `k-toast`, `k-table`, `k-tree`, and more.

### Icon Search Order

`<k-icon name="foo">` searches for `foo.svg` in these directories (first match wins):

1. `/icons/` — consumer's project root `icons/` directory (custom icons)
2. `/framework/icons/` — kempo-app's `icons/` directory (window controls, etc.)
3. `/modules/kempo-ui/icons` — kempo-ui's built-in icons (chevron, close, settings, etc.)

Consumers can override any framework or kempo-ui icon by placing a same-named SVG in their `icons/` directory.

## kempo-css Conventions

**Never write custom CSS for colors, typography, spacing, or layout that kempo-css already covers.**

kempo-css automatically styles `html`, `body`, `input`, `a`, `nav>a`, headings, etc. via base styles. Use utility classes for everything else:

| Need | Class(es) |
|------|-----------|
| Flex row | `row` (also sets `flex-wrap:wrap`) |
| Flex grow | `flex-1`, `flex-2`, … |
| Flex column layout | `d-f` + inline `flex-direction:column` (no utility) |
| Padding x/y | `px`, `py`, `pxh`, `pyh`, `pxq`, `pyq` |
| Margin x/y | `mx`, `my`, `mxh`, `myh` |
| Border | `by` (top+bottom), `bx` (left+right) |
| Background | `bg-default`, `bg-alt` |
| Text color | `tc-default`, `tc-primary`, `tc-muted` |
| Display | `d-f`, `d-b`, `d-n`, `d-g` |
| Full width | `full` |
| Text align | `ta-left`, `ta-center`, `ta-right` |

**Key CSS variables** (set by kempo-css on `:root`):
- `--tc` — base text color (light-dark aware)
- `--tc_primary`, `--tc_muted` — text variants
- `--c_bg`, `--c_bg__alt` — background colors (double underscore)
- `--c_primary`, `--c_border` — accent and border
- `--spacer`, `--spacer_h`, `--spacer_q` — spacing scale
- `--ff_body`, `--fs_base`, `--fw_base` — typography
- `--radius`, `--animation_ms` — shape and motion

## Architecture Notes

- The consumer's `app.html` is fetched at runtime and injected into `#app-shell` in index.html.
- Pages are **HTML fragments** loaded via `<k-import>`. Any `<script>` in a fragment is executed after the HTML is rendered.
- The titlebar uses `-webkit-app-region: drag` for dragging. Buttons inside it set `-webkit-app-region: no-drag`.
- On macOS, the native traffic lights are used (`hiddenInset` title bar style). On Windows/Linux, custom min/max/close buttons are rendered.
- The database file location: Windows → `%APPDATA%\kempo-app\settings.json`, macOS → `~/Library/Application Support/kempo-app/settings.json`.
- Consumer's `theme.css` is loaded after kempo-css. If the file doesn't exist, the `<link>` self-removes via onerror.

## Testing

The framework ships a test page and mock utilities so that both the framework itself and consumer apps can write browser tests using `kempo-testing-framework`.

### Consumer Test Setup

1. Install `kempo-testing-framework` as a devDependency
2. Add `"test": "npx kempo-test"` to `package.json` scripts
3. Create a `tests/` directory
4. Write `.browser-test.js` files (or `.node-test.js` for Node tests)

Browser test files reference the shared test page, which mocks the Electron `window.api` and sets up import maps:

```js
export const page = "/node_modules/kempo-app/testing/test-page.html";

export const beforeAll = async () => {
  // Dynamic imports — do NOT use top-level imports for /framework/ or /modules/ paths
  const { MyComponent } = await import("/components/my-component.js");
};

export default {
  "my test": async ({ pass, fail }) => {
    const el = document.createElement("my-component");
    document.body.appendChild(el);
    pass();
  }
};
```

### Test Infrastructure

```
testing/
  mocks.js         Shared window.api mock (matches preload.cjs API surface)
  test-page.html   Consumer-ready test page — import maps, mocks, kempo config
```

**`testing/mocks.js`** — Sets up `window.api` with an in-memory db store and no-op stubs for window controls, notifications, and context menu. The db store is exposed as `window.__kempoTestDbStore` for direct access in tests. Loaded as a classic `<script>` (not a module) so it runs synchronously before component imports.

**`testing/test-page.html`** — Consumer test page with:
- Import map: `/modules/` → `/node_modules/`, `/framework/` → `/node_modules/kempo-app/`
- `window.api` mock (via `mocks.js`)
- `window.kempo` config with browser-relative paths to CSS and icons

### Framework Tests vs Consumer Tests

The only difference is the import map — framework tests map `/framework/` → `/` (the framework IS the project root), while consumer tests map `/framework/` → `/node_modules/kempo-app/`. Both share the same `mocks.js` for the API mock.

### Important: No Top-Level Imports

Browser test files are parsed by Node.js (to extract the `page` export) before running in the browser. Top-level `import` statements with `/framework/` or `/modules/` paths will fail in Node. Always use dynamic `import()` inside `beforeAll`:

```js
// BAD — fails when Node parses the file
import "/modules/kempo-ui/dist/components/Icon.js";

// GOOD — runs only in the browser
export const beforeAll = async () => {
  await import("/modules/kempo-ui/dist/components/Icon.js");
};
```

## Coding Style

### Code Organization
Use multi-line comments to separate code into logical sections. Group related functionality together.

```js
/*
  Lifecycle Callbacks
*/
```

### Avoid Single-Use Variables and Functions
Avoid defining a variable or function only to use it once — inline the logic. Exceptions:
- Recursion
- Scope encapsulation
- Readability (complex expressions)
- Used more than once

### Minimal Comments
Assume readers understand the language. Only add comments for:
- Complex logic
- Anti-patterns
- Code section organization (using the `/* Section */` style above)

Do not put random empty lines within code. Add them where they aid readability (above/below function/class definitions, between logical blocks). No empty lines in CSS.

End each file with an empty line. End each line with `;` where possible.

### Spacing
No space after `if`, `for`, `while`, etc. No spaces inside parentheses.

```js
if(condition){
  // ...
}
```

### Prefer Arrow Functions
Use arrow functions when possible, especially for class methods (avoids binding issues). Use implicit returns for single-expression bodies. Omit parentheses for single parameters.

```js
const addOne = n => n + 1;
```

Exception: Lit component lifecycle methods (`connectedCallback`, `render`, etc.) should remain regular methods for framework compatibility.

### Naming
- No leading underscores (`_myVar`, `_myMethod`) — ever.
- For true private class members, use native JS private fields: `#myField`, `#myMethod()`.
- Use clear, descriptive names.

### Module Exports
- Single export → `export default` (no name, no `const`).
- Multiple exports → named exports, no default.

### Code Reuse
- Shared logic used in one file → utility function in that file.
- Shared logic used in multiple files → module in `src/utils/`.
