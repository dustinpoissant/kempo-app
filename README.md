# kempo-app

An [Electron](https://www.electronjs.org/) desktop app framework built on [kempo-ui](https://github.com/dustinpoissant/kempo-ui) (Lit web components) and [kempo-css](https://github.com/dustinpoissant/kempo-css). Create a few files, run one command, and you have a native desktop app with a custom titlebar, SPA routing, persistent settings, and a full component library — no boilerplate required.

---

## Getting Started

```sh
mkdir my-app && cd my-app
npm init -y
npm install kempo-app
```

Then create these files:

**`package.json`** — add configuration fields and scripts:
```json
{
  "name": "my-app",
  "type": "module",
  "appName": "My App",
  "appIcon": "media/icon.png",
  "protocolName": "my-app",
  "scripts": {
    "start": "kempo-app",
    "dev": "kempo-app --dev",
    "interact": "kempo-interact"
  },
  "dependencies": {
    "kempo-app": "^0.0.1"
  }
}
```

**`titlebar.html`** — the titlebar (optional, injected first):
```html
<app-titlebar class="bg-alt bb">
  <b slot="left">My App</b>
  <k-theme-switcher slot="right" class="no-drag"></k-theme-switcher>
</app-titlebar>
```

**`app.html`** — the app shell (nav bar + page container):
```html
<script type="module">
  import "/modules/kempo-ui/dist/components/Card.js";
  import "/modules/kempo-ui/dist/components/Toggle.js";
  import "/modules/kempo-ui/dist/components/ThemeSwitcher.js";
</script>

<nav class="bg-alt px bb">
  <a href="#/" class="nav-link">Home</a>
  <a href="#/settings" class="nav-link">Settings</a>
</nav>
<app-page class="flex-1 py px"></app-page>
```

**`pages/home.html`** — your home page:
```html
<h1>Hello World</h1>
<p>Welcome to my app.</p>
```

```sh
npm start
```

---

## Project Structure

```
my-app/
  package.json          App config — appName, appIcon, protocolName, scripts
  app.html              App shell fragment — nav bar, component imports
  pages/
    home.html           Loaded for route #/
    settings.html       Loaded for route #/settings
    <name>.html         Loaded for route #/<name>
  media/
    icon.png            App icon (256×256 or 512×512 PNG)
  icons/                Custom SVG icons — override any built-in icon here
  titlebar.html         Optional — injected before app.html (put app-titlebar here)
  app.js                Optional — ESM module, runs after app.html is injected
  backend.js            Optional — Node.js code in the main process
  theme.css             Optional — CSS variable overrides for theming
```

---

## package.json Configuration

| Field | Description | Default |
|-------|-------------|---------|
| `appName` | Display name in titlebar and window title | `name` field, then `"Kempo App"` |
| `appIcon` | Relative path to app icon PNG | none |
| `protocolName` | Custom protocol scheme (must be URL-safe) | `"kempo-app"` |

---

## Routing

The router is **convention-based** — no config needed. Hash routes map directly to files in `pages/`:

| URL hash | File loaded |
|----------|-------------|
| `#/` | `pages/home.html` |
| `#/settings` | `pages/settings.html` |
| `#/any-name` | `pages/any-name.html` |

**Query parameters** are also supported and exposed on `window.route`:
```
#/settings?tab=appearance
→ window.route.path    // "/settings"
→ window.route.params  // { tab: "appearance" }
```

To add a new page: create the file, add a nav link. That's it.

---

## titlebar.html — The Titlebar

`titlebar.html` is an optional HTML fragment injected into the app before `app.html`. Place your `<app-titlebar>` here:

```html
<app-titlebar class="bg-alt bb">
  <k-dropdown slot="left" class="no-drag">...</k-dropdown>
  <b>My App</b>
  <k-theme-switcher slot="right" class="no-drag"></k-theme-switcher>
</app-titlebar>
```

See [`app-titlebar`](#app-components) for full usage.

---

## app.html — The App Shell

`app.html` is an HTML fragment (no `<html>`, `<head>`, or `<body>`) injected after `titlebar.html`. It must contain:

- A `<nav>` element with `.nav-link` anchors pointing to hash routes
- An `<app-page>` element where pages will be loaded

```html
<nav class="bg-alt px bb">
  <a href="#/" class="nav-link">Home</a>
  <a href="#/settings" class="nav-link">Settings</a>
</nav>
<app-page class="flex-1 py px"></app-page>
```

The `active` class is automatically applied to the current nav link.

### Importing Components

`app.html` is also where you import kempo-ui components you want available across all pages:

```html
<script type="module">
  import "/modules/kempo-ui/dist/components/Card.js";
  import "/modules/kempo-ui/dist/components/Toggle.js";
  import "/modules/kempo-ui/dist/components/ThemeSwitcher.js";
  import "/modules/kempo-ui/dist/components/Tabs.js";
  import "/modules/kempo-ui/dist/components/Dialog.js";
  /* ...any others you need */
</script>
```

Available components: `Accordion`, `Card`, `Dialog`, `Dropdown`, `Icon`, `Import`, `Spinner`, `Tabs`, `ThemeSwitcher`, `Toast`, `Table`, `Toggle`, `Tree`, and more. All in `/modules/kempo-ui/dist/components/`.

---

## app.js — Optional Renderer Script

`app.js` (in your project root) is an optional ESM module that runs after `titlebar.html` and `app.html` are injected. Use it for app-level JavaScript that doesn't need to be inline in your HTML:

```js
// app.js
const platform = document.documentElement.dataset.platform;
console.log("Running on:", platform);

const devMode = await window.api.isDev();
if(devMode) console.log("Dev mode active");
```

This runs once at startup, before the router fires. It has full access to `window.api` and all injected DOM elements.

---

## kempo-ui Components

Components are [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) with a `k-` prefix, built on [Lit](https://lit.dev/). Use them directly in your HTML fragments:

```html
<k-card label="My Section">
  <p>Content goes here</p>
</k-card>

<k-toggle id="my-toggle"></k-toggle>

<k-theme-switcher></k-theme-switcher>

<k-icon name="settings"></k-icon>
```

**`k-toggle`** fires a `toggle` event with the new value:
```js
document.getElementById("my-toggle").addEventListener("toggle", e => {
  console.log(e.detail.value); // true / false
});
```

---

## Icons

Icons are inline SVGs loaded by `<k-icon name="icon-name">`. The lookup searches these directories in order — first match wins:

1. `/icons/` — your `icons/` directory (custom overrides)
2. `/framework/icons/` — kempo-app's `icons/` directory (window controls)
3. `/modules/kempo-ui/icons` — kempo-ui's bundled icon set

### Using kempo-ui Icons

kempo-ui ships hundreds of icons (Google Material Symbols). Use the CLI tools to find and download them:

```sh
# Search for available icons by keyword
npx kempo-listicons settings
npx kempo-listicons home
npx kempo-listicons arrow

# Download an icon SVG into your icons/ directory
npx kempo-geticon settings
npx kempo-geticon home
```

After running `kempo-geticon`, the SVG is saved to `icons/settings.svg` and immediately available as `<k-icon name="settings">`.

### Custom Icons

Place any `.svg` file in your `icons/` directory and reference it by filename (without extension):
```html
<k-icon name="my-custom-icon"></k-icon>   <!-- loads icons/my-custom-icon.svg -->
```

SVGs should have a `viewBox` attribute. `width`, `height`, `fill` are managed automatically.

---

## Theming

Create `theme.css` in your project root to override kempo-css CSS variables. It loads after kempo-css, so anything you set here wins.

**Changing the primary color:**
```css
:root {
  --c_primary: rgb(192, 39, 45);
  --c_primary__hover: rgb(155, 25, 30);
  --c_input_accent: rgb(192, 39, 45);
  --c_highlight: rgba(192, 39, 45, 0.2);
}
```

**Key variables:**

| Variable | Controls |
|----------|----------|
| `--c_primary` | Buttons, links, active nav, focus rings |
| `--c_primary__hover` | Hover state for primary elements |
| `--c_secondary` | Secondary buttons |
| `--c_bg` | Page background |
| `--c_bg__alt` | Nav/sidebar/card backgrounds |
| `--c_border` | Borders everywhere |
| `--c_danger` | Error/destructive states |
| `--tc` | Base text color |
| `--tc_primary` | Accent text, active states |
| `--tc_muted` | Subdued/helper text |
| `--ff_body` | Body font family |
| `--fs_base` | Base font size |
| `--spacer` | Base spacing unit |
| `--radius` | Border radius |
| `--animation_ms` | Transition duration |

kempo-css supports light/dark mode automatically via `light-dark()`. Use `<k-theme-switcher>` to let users toggle it.

---

## kempo-css Utility Classes

kempo-css provides utility classes for layout and spacing. Avoid writing custom CSS for things it covers:

| Need | Class |
|------|-------|
| Flex row (wrapping) | `row` |
| Flex grow | `flex-1`, `flex-2` |
| Padding (all) | `p` |
| Padding x / y | `px` / `py` |
| Padding half | `pxh` / `pyh` |
| Margin x / y | `mx` / `my` |
| Border top+bottom | `by` |
| Border left+right | `bx` |
| Alt background | `bg-alt` |
| Muted text | `tc-muted` |
| Primary text | `tc-primary` |
| Full width | `full` |
| Hide | `d-n` |
| Grid | `d-g` |

---

## Renderer API (`window.api`)

Available in any page HTML fragment or script:

```js
// Persistent settings (saved to userData/settings.json)
await window.api.db.get()              // { key: value, ... }
await window.api.db.get("theme")       // "dark"
await window.api.db.set("theme", "dark")
await window.api.db.delete("theme")
await window.api.db.has("theme")       // true / false
await window.api.db.clear()

// Window controls
window.api.window.minimize()
window.api.window.maximize()           // toggles maximize/restore
window.api.window.close()

// Platform detection
const platform = await window.api.getPlatform() // "mac" | "win" | "linux"
```

**Settings are persisted** to the OS user data directory:
- Windows: `%APPDATA%\<appName>\settings.json`
- macOS: `~/Library/Application Support/<appName>/settings.json`

---

## backend.js — Main Process Hook

If `backend.js` exists in your project root, it runs in Electron's main process at startup. Export a default function that receives `{ db, ipc, app }`:

```js
export default ({ db, ipc, app }) => {
  // Custom IPC handler — callable from renderer via window.api (add to preload)
  ipc.handle("my-channel", async (event, data) => {
    const stored = db.get("someKey");
    return { result: "ok", stored };
  });
};
```

- `db` — the settings database (same `get`/`set`/`delete`/`has`/`clear` API)
- `ipc` — Electron's `ipcMain`
- `app` — Electron's `app` instance

---

## Opening Files and Links

### Deep Links (Custom URL Protocol)

The framework automatically registers your `protocolName` (from `package.json`) as the system-wide URL handler. If your `protocolName` is `"my-app"`, clicking `my-app://` links anywhere on the system will open your app.

The framework normalizes the platform differences (macOS `open-url`, Windows/Linux `second-instance`, and cold-launch argv) into a single unified event. Handle it in `backend.js`:

```js
export default ({ db, ipc, app }) => {
  app.on("open-link", url => {
    // url = "my-app://some/path?foo=bar" — works on all platforms
    const parsed = new URL(url);
    console.log(parsed.pathname, parsed.searchParams);
  });
};
```

> **Note:** On Windows, `setAsDefaultProtocolClient` only fully works for packaged apps (not during development). On macOS it works in development.

### File Associations

To open specific file types (e.g. `.myext`) your app needs to be registered with the OS. This is done at **install time** via a packager like [electron-builder](https://www.electron.build/), not at runtime:

```json
// electron-builder config (package.json or electron-builder.yml)
{
  "fileAssociations": [
    {
      "ext": "myext",
      "name": "My Document",
      "description": "My App Document",
      "role": "Editor"
    }
  ]
}
```

The framework normalizes the platform differences (macOS `open-file` event, Windows/Linux argv) into a single unified event. Handle it in `backend.js`:

```js
export default ({ db, ipc, app }) => {
  app.on("open-path", filePath => {
    // filePath = "/Users/alice/documents/file.myext" — works on all platforms
    console.log("Open file:", filePath);
  });
};
```

---

## LLM Interaction Tools

kempo-app ships a `kempo-interact` CLI that lets an LLM (or you) inspect and drive the running app via Chrome DevTools Protocol. Start the app in dev mode first:

```sh
npm run dev
```

Then in another terminal:

```sh
# Always start with structure or dom to understand the current state
npm run interact -- structure          # buttons, inputs, links, selects
npm run interact -- dom                # full page HTML

# Navigation
npm run interact -- navigate /settings

# Screenshots
npm run interact -- screenshot                        # saves screenshot.png
npm run interact -- screenshot path/to/output.png

# Clicking
npm run interact -- click "#submit-btn"
npm run interact -- click-text "Save"

# Typing
npm run interact -- type "#username" "Alice"

# JavaScript evaluation
npm run interact -- eval "window.route"
npm run interact -- eval "await window.api.db.get()"
npm run interact -- eval "document.title"

# Info
npm run interact -- title
npm run interact -- url
```

### Creating an LLM Skill for Your App

To give your LLM full context about how to build and debug your specific app, create an `AGENTS.md` file in your project root. This file is automatically read by GitHub Copilot and many other LLM tools as project-level instructions.

**Example `AGENTS.md`:**

```markdown
# My App — Copilot Instructions

## Project
This is a kempo-app desktop app. Run `npm run dev` to start it, then use
`npm run interact -- <command>` to inspect and interact with it.

## Pages
- Home (#/) — dashboard overview
- Settings (#/settings) — user preferences

## Interact Commands
Always run `structure` first to understand the current page before clicking.

    npm run interact -- structure
    npm run interact -- screenshot
    npm run interact -- navigate /settings
    npm run interact -- eval "await window.api.db.get()"

## Database Keys
- `theme` — "light" | "dark" | "auto"
- `username` — string

## component usage
Pages use k-card, k-toggle, k-theme-switcher from kempo-ui.
Import new components in app.html before using in pages.
```

The more context you give the LLM about your specific app's structure, data, and pages, the more effectively it can help you build and debug it.

---

## App Icon

Place a PNG icon in `media/icon.png` (256×256 or 512×512 recommended) and reference it in `package.json`:

```json
"appIcon": "media/icon.png"
```

Electron uses this for the window icon on Windows (taskbar, Alt+Tab) and Linux. On macOS, the `.icns` format is typically used when packaging for distribution (tools like [electron-builder](https://www.electron.build/) handle the conversion).

---

## Context Menu

The framework automatically shows a native right-click context menu with smart defaults — no setup required:

- **Editable inputs** → Cut, Copy, Paste
- **Selected text** → Copy
- **Dev mode** → Inspect Element (always appended)

### Adding Custom Items

Call `window.api.contextMenu.show(items)` in a `contextmenu` event handler to add extra items above the defaults. Register a global click handler once with `window.api.contextMenu.onClick(cb)`:

```js
// Register once — e.g. in your app.html <script> block
window.api.contextMenu.onClick(id => {
  if(id === "delete") handleDelete();
  if(id === "rename") handleRename();
});

// Per-element extra items
document.getElementById("my-item").addEventListener("contextmenu", () => {
  window.api.contextMenu.show([
    { id: "rename", label: "Rename" },
    { id: "delete", label: "Delete" },
  ]);
});
```

Item objects accept any [Electron MenuItem](https://www.electronjs.org/docs/latest/api/menu-item) field except `click` — use `onClick` instead. A separator is automatically inserted between your items and the framework defaults when both are present.

---

## Testing

kempo-app ships shared test infrastructure so you can write browser tests for your components and pages using [kempo-testing-framework](https://github.com/dustinpoissant/kempo-testing-framework). The framework provides a mock `window.api` and a ready-made test page that replaces the Electron environment with a plain browser setup.

### Setup

```sh
npm install --save-dev kempo-testing-framework
```

Add a test script to your `package.json`:
```json
"scripts": {
  "test": "npx kempo-test"
}
```

Create a `tests/` directory and write `.browser-test.js` files (or `.node-test.js` for Node-only tests).

### Writing Browser Tests

Every browser test file exports a `page` pointing to the shared test page, an optional `beforeAll` for setup, and a default object of test functions:

```js
export const page = "/node_modules/kempo-app/testing/test-page.html";

export const beforeAll = async () => {
  // Dynamic imports — runs in the browser, not Node
  await import("/modules/kempo-ui/dist/components/Card.js");
};

export default {
  "card renders content": async ({ pass, fail }) => {
    const card = document.createElement("k-card");
    card.label = "Test";
    card.innerHTML = "<p>Hello</p>";
    document.body.appendChild(card);
    await card.updateComplete;
    if(card.shadowRoot.querySelector("slot")) pass();
    else fail("No slot found");
    card.remove();
  }
};
```

### What the Test Page Provides

**`testing/test-page.html`** sets up three things a browser test needs to run outside Electron:

1. **Import map** — remaps `/modules/` → `/node_modules/` and `/framework/` → `/node_modules/kempo-app/` so protocol-style imports resolve in a plain browser
2. **`window.api` mock** (via `testing/mocks.js`) — in-memory database, no-op window controls, platform/appName stubs. Matches the full `preload.cjs` API surface
3. **`window.kempo` config** — browser-relative paths to kempo-css and icon directories

The mock db store is exposed as `window.__kempoTestDbStore` for direct access in tests.

### Important: No Top-Level Imports

Test files are parsed by Node.js to extract the `page` export before running in the browser. Top-level `import` statements with `/framework/` or `/modules/` paths will fail in Node. Always use dynamic `import()` inside `beforeAll`:

```js
// BAD — fails when Node parses the file
import "/modules/kempo-ui/dist/components/Icon.js";

// GOOD — runs only in the browser
export const beforeAll = async () => {
  await import("/modules/kempo-ui/dist/components/Icon.js");
};
```

### Running Tests

```sh
npm test
```

The test runner discovers all `.browser-test.js` and `.node-test.js` files in `tests/` recursively, runs them, and reports results.

---

## Architecture Overview

- **Custom protocol** — all files served via `<protocolName>://app/`. Three zones: `/framework/` (kempo-app internals), `/modules/` (node_modules), and everything else (your project root).
- **app.html injection** — fetched at startup and injected into the shell. Scripts inside run after injection.
- **Pages as fragments** — each page is a plain HTML fragment loaded via `<k-import>`. Scripts in fragments run after the HTML renders.
- **Frameless window** — custom titlebar handles drag, min/max/close. macOS uses native traffic lights; Windows/Linux use custom SVG buttons.
- **No build step** — ESM throughout, served directly via the custom protocol. Edit files and reload.
