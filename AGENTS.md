# AGENTS.md

## Project Overview

**kempo-app** is an installable npm package that provides an Electron desktop app framework built on **kempo-ui** (Lit web components) and **kempo-css**. Consumers `npm install kempo-app`, create a few files in their project root, and run `kempo-app` to launch.

The framework provides: custom protocol, frameless titlebar, hash-based SPA router, file-based JSON database, and an optional backend hook.

## Consumer Project Structure

A consumer's project looks like this (no `src/` directory needed):

```
my-app/
  package.json       "appName", "appIcon", "protocolName" configure the app
  shell.html         Optional — nav + <app-page> shell (default is just <app-page>)
  pages/
    index.html       Home page fragment (loaded for #/)
    settings.html    Settings page fragment (loaded for #/settings)
  media/             App assets — icon.png goes here
    icon.png         App icon (reference as "appIcon": "media/icon.png" in package.json)
  icons/             Optional — custom SVG icons (searched first by k-icon)
  schema/            Optional — subdirectories define databases; .js files inside define tables
    mydb/            Each subdirectory name becomes a database name
      contacts.js    Each file exports { column: { type, required, default, unique } }
  init.js            Optional — runs once on first launch (create tables, seed data)
  update.js          Optional — runs when package.json version changes
  backend.js         Optional — runs in main process, receives { ipc, app, Menu }
  theme.css          Optional — loaded after kempo-css for custom theming
  titlebar.html      Optional — injected before shell.html (place app-titlebar here)
  app.js             Optional — ESM module, runs after shell.html is injected
```

### Consumer package.json Fields

All framework config lives in the `kempo-app` field:

```json
{
  "kempo-app": {
    "appName": "My App",
    "appIcon": "media/icon.png",
    "protocolName": "my-app",
    "shell": "shell.html"
  }
}
```

| Key | Description | Default |
|-----|-------------|---------|
| `appName` | Display name shown in titlebar and window title | `name` field, then `"Kempo App"` |
| `appIcon` | Path to app icon (relative to project root) | none |
| `protocolName` | Custom protocol scheme name | `"kempo-app"` |
| `shell` | Default shell HTML file for new windows | `"shell.html"` |
| `titlebar` | Titlebar HTML file, `true` for default, or `false` to disable | `"titlebar.html"` |
| `menuBar` | Show the native menu bar (File, Edit, View…). Only applies when `titlebar` is `true` | `false` |
| `pages` | Directory containing page HTML fragments | `"pages"` |

## Framework Structure (this repo)

```
bin/
  kempo-app.js       CLI entry point. Sets KEMPO_APP_ROOT=cwd, spawns Electron.
src/
  main/
    main.js          Electron main process. Protocol, IPC, window, backend hook.
    preload.cjs      Exposes api to the renderer. Must be .cjs — Electron preloads cannot use ESM.
    database.js      File-based JSON database. Each table is a JSON file in app.getPath('userData')/db/.
    schema.js        Schema engine. Reads consumer's schema/ files, creates/migrates/versions SQL tables.
  renderer/
    index.html       Minimal HTML shell — loads kempo-css, app.css, theme.css, app.js.
    app.js           Fetches shell.html, injects shell, runs convention-based router.
    app.css          Framework styles — scrollbar, layout, nav indicator.
    titlebar.js      Custom frameless titlebar (mac + windows/linux).
icons/               Framework SVG icons (window-minimize, window-maximize, etc.).
scripts/
  interact.js        CLI for interacting with the running app via CDP.
example/              Example consumer app for testing the framework.
  package.json       Consumer config (appName, protocolName, deps)
  shell.html         Example app shell
  pages/             Example pages
```

## Custom Protocol

All files are served through a custom protocol (default `kempo-app://`). The scheme name is configurable via `"protocolName"` in the consumer's package.json. The framework also automatically calls `app.setAsDefaultProtocolClient(protocolName)`, so the scheme is registered with the OS as a system-wide URL handler — clicking `protocolName://` links will open the app.

Three path zones:
- `/framework/` → kempo-app's `src/` directory (framework files)
- `/modules/` → consumer's `node_modules/` (dependencies)
- Everything else → consumer's project root (shell.html, pages/, theme.css, etc.)

## npm Scripts

Consumer's `package.json` should include:
```json
"scripts": {
  "start": "kempo-app",
  "dev": "kempo-app --dev",
  "buildStandalone": "kempo-app --build-standalone",
  "buildInstaller": "kempo-app --build-installer",
  "interact": "kempo-interact"
}
```

| Command | What it does |
|---------|-------------|
| `npm start` | Run the app |
| `npm run dev` | Run with DevTools + CDP on port 9222 + Node inspector on 5858 |
| `npm run buildStandalone` | Package the app for the host OS/arch into `dist/win-unpacked/` (no installer) |
| `npm run buildInstaller` | Build an installer for the host OS into `dist/` (NSIS wizard on Windows, plain dir elsewhere) |
| `npm run interact -- <cmd>` | Interact with the running app (requires dev mode) |

## Packaging (`--build-standalone` / `--build-installer`)

Both are powered by **`electron-builder`**, host OS/arch only — no cross-compiling.
`--build-standalone` produces a runnable `dist/win-unpacked/` folder; `--build-installer`
additionally builds a real installer wizard — NSIS on win32 (install-location page, Install
button, Start Menu + optional Desktop shortcut), or a plain dir everywhere else for
now (Mac/Linux installer targets need extra system tooling we don't assume is
installed).

None of this touches the consumer's `package.json` on disk — `runBuild()` in
`bin/kempo-app.js` passes everything `electron-builder` needs straight through its
API instead:
- `main` → injected into the *packaged copy's* `package.json` via `extraMetadata`
  (dev/start run kempo-app's own `main.js` directly via `KEMPO_APP_ROOT`, so there's
  never a real consumer entry script otherwise — but the copy still needs `main` to
  exist for the package to be loadable).
- `electronVersion` → kempo-app's own resolved Electron version, passed directly,
  which skips `electron-builder`'s devDependencies-presence lookup entirely.
- `npmRebuild: false` → native deps here (better-sqlite3, sharp, opencv-js,
  onnxruntime via `@huggingface/transformers`, ...) already ship Electron-ABI-matched
  prebuilt binaries; rebuilding needs node-gyp/build tools we don't assume installed.
- `asar: false` → those same native deps' sibling DLLs aren't caught by asar's
  default unpack (`*.node` files only), which breaks `dlopen` at runtime.

**Icon embedding**: `electron-builder`'s own icon/sign step (`win.signAndEditExecutable`)
shells out to `app-builder.exe`'s `rcedit` subcommand, which — even with no signing
certificate configured — downloads a `winCodeSign` bundle containing two mac-only
`.dylib` *symlinks* unrelated to what it actually needs on Windows. Creating those
symlinks needs a Windows privilege standard (non-elevated, non-Developer-Mode)
accounts don't have, which crashes the whole build. We disable that step
(`signAndEditExecutable: false`) and instead embed the icon ourselves in an
`afterPack` hook: convert the consumer's PNG via `app-builder.exe`'s `icon` subcommand
(confirmed standalone-safe, no `winCodeSign` involved — only its `rcedit` subcommand
pulls that in) and embed it with the standalone `rcedit` npm package, which bundles
its own `rcedit.exe` with no such download. Best-effort: if it fails, the `.exe` just
keeps Electron's default icon rather than breaking the build.

`src/main/main.js`'s `appRoot` falls back to `app.getAppPath()` (not `process.cwd()`)
when `app.isPackaged`, since a packaged app's cwd is wherever the OS launched the
`.exe` from, not the app directory.

## Remote Debugging (CDP)

`npm run dev` exposes the **Chrome DevTools Protocol on port `9222`** and a **Node inspector on port `5858`**.

- List targets: `curl http://localhost:9222/json/list` — the renderer target's `title` is the app's `appName`.
- Drive it with any CDP client (chrome-remote-interface, Puppeteer `puppeteer.connect`, raw WebSocket) via the target's `webSocketDebuggerUrl`, or use the higher-level `npm run interact` wrapper below.
- **`preload.cjs` changes take effect on a renderer reload** (the preload re-runs on every page load) — no full restart needed. Main-process changes (`main.js`, `backend.js`, `api/*.js`) require restarting the app.

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

## API

`api` is a global available everywhere — renderer scripts, page fragments, `backend.js`, `init.js`, and `update.js`. The framework sets it up on both `window` (renderer) and `global` (main process) so you can use `api.*` without a prefix in any context.

```js
// Database — each table is a separate JSON file
const settings = api.jsonDB("settings");       // get a table handle
await settings.get()                              // get all keys in the table
await settings.get("key")                         // get one value
await settings.set("key", val)                    // set a value
await settings.delete("key")
await settings.has("key")
await settings.clear()

// Use any table name — each becomes its own JSON file
const myData = api.jsonDB("myData");
await myData.set("key1", "value1")
await myData.get()                                // { key1: "value1" }

// SQL Database — requires better-sqlite3 in consumer project
// params bind into `?` placeholders — always prefer this over baking values into the sql text
// yourself (no escaping needed, and it can't be broken by a value that happens to contain a
// quote). SELECT returns array of rows; anything else returns { changes, lastInsertRowid };
// throws on error.
await api.sqlQuery("mydb", "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)")
await api.sqlQuery("mydb", "INSERT INTO users (name) VALUES (?)", ["Alice"])  // { changes: 1, lastInsertRowid: 1 }
await api.sqlQuery("mydb", "SELECT * FROM users WHERE name = ?", ["Alice"])   // [{ id, name }, ...]

// Runs a batch of { sql, params } statements as one all-or-nothing transaction — if any
// statement throws, every statement in the batch is rolled back, not just the one that failed.
// Returns an array of per-statement results, same shape sqlQuery() would give for each one.
await api.sqlTransaction("mydb", [
  { sql: "DELETE FROM tags WHERE path = ?", params: [path] },
  { sql: "INSERT INTO tags (path, tag) VALUES (?, ?)", params: [path, "cat"] },
  { sql: "INSERT INTO tags (path, tag) VALUES (?, ?)", params: [path, "dog"] },
])

// Window controls
api.window.minimize()
api.window.maximize()
api.window.close()
api.window.new()          // open a new app window
api.window.new("#/page")  // open a new window at a specific route
api.window.new({ hash: "#/page", shell: "editor-shell.html" }) // new window with a different shell

// Notifications
const id = await api.notification.show({ title, body, icon, silent, subtitle, urgency, timeoutType })
await api.notification.isSupported() // true / false

// Platform
const platform = await api.getPlatform() // 'mac' | 'win' | 'linux'
```

## Window Events

The framework dispatches custom events on `window` that any script or component can listen for:

| Event | Fired when | `event.detail` |
|-------|-----------|----------------|
| `jsondb_change:{table}` | `api.jsonDB("table").set()` completes | `{ key, value }` |
| `routechange` | Hash-based route changes | `{ path, params }` |
| `notification:click` | User clicks a notification | `{ id }` |
| `notification:close` | Notification is dismissed | `{ id }` |
| `notification:reply` | User submits inline reply (macOS) | `{ id, reply }` |

```js
window.addEventListener("jsondb_change:settings", e => {
  console.log(e.detail.key, e.detail.value);
});
```

## Router

The router is **convention-based** — no route config needed.

- `#/` → loads `pages/index.html`
- `#/settings` → loads `pages/settings.html`
- `#/any-page` → loads `pages/any-page.html`

Query parameters are supported:
- `#/settings?tab=appearance` → `window.route.params.tab === "appearance"`

`window.route` is always available with `{ path, params }`.

### Adding a New Page

1. Create `pages/my-page.html` as an HTML fragment
2. Add a nav link in `shell.html`:
   ```html
   <a href="#/my-page" class="nav-link">My Page</a>
   ```

That's it — no route registration needed.

## Lifecycle Hooks

The framework supports three optional lifecycle hooks in the consumer's project root. Each must export a default function.

### init.js — First Run

Runs once on the very first app launch. Use it to create database tables, seed initial data, or perform one-time setup.

```js
export default ({ ipc, app, Menu }) => {
  await api.sqlQuery("myapp", `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT
  )`);
  await api.sqlQuery("myapp", `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`);
};
```

### update.js — Version Change

Runs when the app's `version` in package.json changes from the previously stored version. Receives `from` and `to` version strings in addition to the standard context.

```js
export default ({ ipc, app, Menu, from, to }) => {
  if(from === "1.0.0"){
    await api.sqlQuery("myapp", `ALTER TABLE users ADD COLUMN phone TEXT`);
  }
};
```

### Startup Sequence

1. **Framework init** — JSON DB and SQL DB systems made available
2. **init.js** — runs only on first launch, or **update.js** — runs only when version changes
3. **Schema sync** — creates/migrates tables from `schema/` files (every startup)
4. **backend.js** — runs every startup
5. **Window creation** — app window opens

## Schema Tables

The `schema/` directory provides a no-SQL way to define and use SQLite tables. Create subdirectories
named after your databases, then add JS files inside each one — the directory name becomes the database
name and the file name becomes the table name and the default export describes the columns.

### Schema File Format

```js
// schema/myapp/contacts.js
export default {
  name: { type: "text", required: true },
  email: { type: "text", unique: true },
  phone: { type: "text" },
  age: { type: "integer" },
  score: { type: "real", default: 0 },
};

export const version = 1;
```

If no column has `primary: true`, the table automatically gets an `id INTEGER PRIMARY KEY AUTOINCREMENT` column. To use a custom primary key:

```js
// schema/myapp/settings.js — text primary key, no auto-generated id
export default {
  key: { type: "text", primary: true },
  value: { type: "text" },
};

export const version = 1;
```

Mark more than one column `primary: true` for a **composite primary key** — the row's identity is those columns together, e.g. a table keyed by (path, tag) where the same path can have many tags but never the same tag twice:

```js
// schema/myapp/tags.js — composite key, no auto-generated id
export default {
  path: { type: "text", primary: true, required: true },
  tag: { type: "text", primary: true, required: true },
};

export const version = 1;
```

A composite key never gets AUTOINCREMENT (SQLite only allows that on a single integer column) — inserting a duplicate combination fails instead.

### Column Options

| Option | Description |
|--------|-------------|
| `type` | `"text"`, `"integer"`, `"real"`, or `"blob"` (defaults to `"text"`) |
| `primary` | Part of the primary key. One column = a normal primary key (integer gets AUTOINCREMENT). More than one column marked `primary: true` = a composite key across all of them together |
| `required` | Adds `NOT NULL` constraint |
| `unique` | Adds `UNIQUE` constraint |
| `default` | Default value for the column |
| `index` | Creates a secondary index on this column |

### Schema Versioning

Each schema file can export a `version` number and an `updates` array to handle migrations beyond simple column additions.

```js
// schema/myapp/contacts.js — versioned schema
export default {
  name: { type: "text", required: true },
  email: { type: "text", unique: true },
  display_name: { type: "text" },
};

export const version = 3;

export const updates = [
  // v1 → v2: just add columns (auto-migrate)
  null,
  // v2 → v3: rename column, then auto-migrate for new columns
  (db) => {
    db.exec("ALTER TABLE contacts RENAME COLUMN username TO display_name");
    return true; // also run auto-migrate after
  },
];
```

**Rules:**
- Always export `version` — defaults to `1` if omitted
- `updates` array: `updates[0]` = v1→v2, `updates[1]` = v2→v3, etc.
- `updates.length` should equal `version - 1`
- Non-function entry (null, undefined) = auto-migrate only (add missing columns)
- Function entry = called with `(db)`, if it returns `true` → also auto-migrate after
- New tables skip all update steps and are created at the latest version
- The framework tracks versions in an internal `_schema` table (invisible to consumers)

### Auto-Migration

On every startup, the framework reads `schema/` files and compares them against the database using `PRAGMA table_info()`. Missing tables are created, missing columns are added via `ALTER TABLE ADD COLUMN`. Existing columns are never removed or modified — use versioned updates or `update.js` with raw SQL for destructive changes.

### Database Name

The database name comes from the subdirectory name under `schema/`. For example, `schema/myapp/contacts.js`
puts the `contacts` table in `myapp.db`. Each subdirectory can contain multiple table files, all stored
in the same database file.

## backend.js Hook

If a `backend.js` file exists in the consumer's project root, it's dynamically imported at startup (after lifecycle hooks). It must export a default function:

```js
export default ({ ipc, app, Menu }) => {
  ipc.handle("my-channel", (e, data) => {
    // custom IPC handler
  });
};
```

- `ipc` — Electron's `ipcMain`
- `app` — Electron's `app`
- `Menu` — Electron's `Menu`

## kempo-ui Components

Full kempo-ui reference: https://github.com/dustinpoissant/kempo-ui/blob/main/llms.txt

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

- `api` is set up on both `window` (renderer via `preload.cjs`) and `global` (main process via `main.js`). When adding a new API method to one, always add an identical method to the other so the same code works in both contexts.
- The consumer's shell HTML (default `shell.html`, configurable via `kempo-app.shell` in package.json) is fetched at runtime and injected into the body of index.html. Each window can use a different shell via `api.window.new({ shell: "other-shell.html" })`.
- Pages are **HTML fragments** loaded via `<k-import>`. Any `<script>` in a fragment is executed after the HTML is rendered.
- The titlebar uses `-webkit-app-region: drag` for dragging. Buttons inside it set `-webkit-app-region: no-drag`.
- On macOS, the native traffic lights are used (`hiddenInset` title bar style). On Windows/Linux, custom min/max/close buttons are rendered.
- The database stores each table as a JSON file in: Windows → `%APPDATA%\kempo-app\db\*.json`, macOS → `~/Library/Application Support/kempo-app/db/*.json`.
- Consumer's `theme.css` is loaded after kempo-css. If the file doesn't exist, the `<link>` self-removes via onerror.

## Testing

The framework ships a test page and mock utilities so that both the framework itself and consumer apps can write browser tests using `kempo-testing-framework`.

### Consumer Test Setup

1. Install `kempo-testing-framework` as a devDependency
2. Add `"test": "npx kempo-test"` to `package.json` scripts
3. Create a `tests/` directory
4. Write `.browser-test.js` files (or `.node-test.js` for Node tests)

Browser test files reference the shared test page, which mocks the Electron `api` global and sets up import maps:

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
  mocks.js         Shared api mock (matches preload.cjs API surface)
  test-page.html   Consumer-ready test page — import maps, mocks, kempo config
```

**`testing/mocks.js`** — Sets up `api` with an in-memory db store and no-op stubs for window controls, notifications, and context menu. The db store is exposed as `window.__kempoTestDbStore` for direct access in tests. Loaded as a classic `<script>` (not a module) so it runs synchronously before component imports.

**`testing/test-page.html`** — Consumer test page with:
- Import map: `/modules/` → `/node_modules/`, `/framework/` → `/node_modules/kempo-app/`
- `api` mock (via `mocks.js`)
- `window.kempo` config with browser-relative paths to CSS and icons

### Framework Tests vs Consumer Tests

The only difference is the import map — framework tests map `/framework/` → `/` (the framework IS the project root), while consumer tests map `/framework/` → `/node_modules/kempo-app/`. Both share the same `mocks.js` for the `api` mock.

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

## Documentation Site

The `docs/` directory contains a static documentation site that reuses the same page content as the `example/` app. It runs in a regular browser (no Electron needed) using a lightweight hash router and a mock `api`.

### Architecture

- `docs/index.html` — Standalone HTML shell with import map, mock API, component imports, and inline router.
- `docs/docs.css` — Browser-adapted layout styles (nav indicator, scrolling).
- `docs/theme.css` — Same theme as the example app.
- `docs/pages/` — **Generated** — copied from `example/pages/` by the build script.
- `docs/modules/` — **Generated** — kempo-css and kempo-ui from `node_modules/`.
- `docs/framework/` — **Generated** — framework components and icons.
- `docs/media/` — **Generated** — media assets from `example/media/`.
- `docs/icons/` — **Generated** — custom icons from `example/icons/`.

### Rules

1. **Never edit files in `docs/pages/`, `docs/modules/`, `docs/framework/`, `docs/media/`, or `docs/icons/` directly.** These are generated by the build script and will be overwritten.
2. **Edit documentation content in `example/pages/` only.** The pages are shared — the example app and the docs site render the same HTML fragments.
3. **Run `npm run build:docs`** after editing any page in `example/pages/` to update the docs site.
4. The shell files (`docs/index.html`, `docs/docs.css`, `docs/theme.css`) are hand-maintained. Edit them directly when the docs site layout or styling needs to change.
5. Generated directories (`docs/modules/`, `docs/framework/`, `docs/pages/`, `docs/media/`, `docs/icons/`) are committed to the repo so GitHub Pages can serve them. Only the shell files need hand-editing.

### app-demo Convention

Interactive demo sections (inputs, buttons, live outputs) are wrapped in `<div class="app-demo">` in the page HTML:

```html
<div class="app-demo">
  <input type="text" id="some-input" />
  <button id="some-btn">Try It</button>
  <pre id="some-output">—</pre>
</div>
```

- In the **Electron app**, `app-demo` has no effect — demos are visible and functional.
- In the **docs site**, `docs/docs.css` sets `.app-demo { display: none }` — demos are hidden entirely.

The docs site includes an `api` stub so framework components (`app-setting-bool`, `app-show`, `app-hide`) don't throw — but no interactive demo functionality is expected to work in the browser.

### Build

```sh
npm run build:docs
```

This runs `scripts/build-docs.js`, which:
- Copies `node_modules/kempo-css/dist/` and `node_modules/kempo-ui/` into `docs/modules/`
- Copies framework components (`src/renderer/components/`, `src/renderer/utils/`) and icons (`icons/`) into `docs/framework/`
- Copies `example/pages/` into `docs/pages/` (fixing absolute `/media/` paths to relative)
- Copies `example/media/` and `example/icons/` into `docs/`

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
