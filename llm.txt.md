# kempo-app — LLM Reference

kempo-app is an npm package that turns a folder of HTML fragments into an Electron desktop app with zero boilerplate.
Docs: https://dustinpoissant.github.io/kempo-app/

## IMPORTANT — Read These First

This project uses kempo-ui (components) and kempo-css (styles/utilities). Before writing any code, fetch and read both of these files:

- kempo-ui: https://raw.githubusercontent.com/dustinpoissant/kempo-ui/refs/heads/main/llm.txt
- kempo-css: https://raw.githubusercontent.com/dustinpoissant/kempo-css/refs/heads/main/llms.txt

NEVER create a custom component if kempo-ui already has one. NEVER write a custom CSS class or inline style for something kempo-css already covers. Always check both files first.

## Install & Run

```sh
npm install kempo-app
```

package.json scripts:
```json
"scripts": {
  "start": "kempo-app",
  "dev": "kempo-app --dev",
  "interact": "kempo-interact"
}
```

`npm start` — run the app

`npm run dev` — run with DevTools + CDP on port 9222 (for LLM interaction)

---

## Project Structure

| File | Required | Description |
|------|----------|-------------|
| `package.json` | yes | Configure `appName`, `appIcon`, `protocolName` |
| `pages/index.html` | yes | Home page fragment, loaded for `#/` |
| `pages/<name>.html` | no | Additional pages, loaded for `#/<name>` |
| `shell.html` | no | Nav + `<app-page>` shell (default is just `<app-page>`) |
| `app.js` | no | ESM module, runs after shell; import kempo-ui components here |
| `titlebar.html` | no | Place `<app-titlebar>` here |
| `theme.css` | no | CSS variable overrides, loaded after kempo-css |
| `backend.js` | no | Runs in Electron main process |
| `icons/` | no | Custom SVG icons (override kempo-ui icons) |
| `media/` | no | App assets (`icon.png`, etc.) |

### package.json config fields

| Field | Description | Default |
|-------|-------------|---------|
| `appName` | Window title and display name | `name` field or `"Kempo App"` |
| `appIcon` | Path to icon (e.g. `"media/icon.png"`) | none |
| `protocolName` | Custom protocol scheme | `"kempo-app"` |

---

## shell.html

Optional. The app shell — include your nav and `<app-page>` where page content renders. If omitted, the default shell is simply `<app-page></app-page>`, so you only need this file if you want a nav or other persistent UI.

```html
<nav>
  <a href="#/">Home</a>
  <a href="#/settings">Settings</a>
</nav>
<app-page></app-page>
```

---

## Routing
Docs: https://dustinpoissant.github.io/kempo-app/#/routing

Hash routes map directly to `pages/` files. No config needed.

| Hash | File |
|------|------|
| `#/` | `pages/index.html` |
| `#/settings` | `pages/settings.html` |
| `#/foo-bar` | `pages/foo-bar.html` |

Query params: `#/settings?tab=theme` → `window.route.params.tab === "theme"`

`window.route` is always available with `{ path, params }`.

Listen for navigation:
```js
window.addEventListener("routechange", e => {
  console.log(e.detail.path, e.detail.params);
});
```

External links: use `target="_blank"` or `window.open()` — opens in system browser automatically.

Open a new app window:
```js
window.api.window.new();           // opens at #/
window.api.window.new("#/settings"); // opens at specific route
```

---

## Pages

Pages are HTML fragments (no `<html>/<head>/<body>`). Any `<script>` in a fragment runs after it renders.

```html
<!-- pages/home.html -->
<h1>Home</h1>
<button id="btn">Click me</button>
<script>
document.getElementById("btn").addEventListener("click", () => alert("clicked"));
</script>
```

---

## Components
Docs: https://dustinpoissant.github.io/kempo-app/#/components

### App Components (auto-imported, no import needed)

**`<app-page>`** — where page content renders (place in shell.html)

**`<app-titlebar>`** — frameless window titlebar with drag support. Slots: `left`, default (center), `right`. Add `class="no-drag"` to interactive elements inside.

```html
<!-- titlebar.html -->
<app-titlebar>
  <b>My App</b>
  <k-theme-switcher slot="right" class="no-drag"></k-theme-switcher>
</app-titlebar>
```

**`<app-show>`** / **`<app-hide>`** — conditional rendering by platform, theme, setting value, dev mode, or maximized state.

| Attribute | Values |
|-----------|--------|
| `platform` | `mac`, `win`, `linux` |
| `theme` | `light`, `dark` |
| `dev` | boolean |
| `maximized` | boolean |
| `setting` | `"table.key=value"` (e.g. `notifications=true`) |

```html
<app-show platform="win"><p>Windows only</p></app-show>
<app-hide setting="notifications=false">
  <button>Send Notification</button>
</app-hide>
```

**`<app-setting-bool>`** — toggle linked to a db setting key:
```html
<app-setting-bool setting="notifications">Enable Notifications</app-setting-bool>
```

**`<app-setting-string>`** — text input linked to a db setting key:
```html
<app-setting-string setting="username">Username</app-setting-string>
```

**`<app-setting-number>`** — number input linked to a db setting key:
```html
<app-setting-number setting="fontSize">Font Size</app-setting-number>
```

### kempo-ui Components
kempo-ui llm.txt: https://raw.githubusercontent.com/dustinpoissant/kempo-ui/refs/heads/main/llm.txt

Import in `app.js`:
```js
import "/modules/kempo-ui/dist/components/Card.js";
import "/modules/kempo-ui/dist/components/Toggle.js";
import "/modules/kempo-ui/dist/components/Tabs.js";
import "/modules/kempo-ui/dist/components/Accordion.js";
import "/modules/kempo-ui/dist/components/Dropdown.js";
import "/modules/kempo-ui/dist/components/ThemeSwitcher.js";
import "/modules/kempo-ui/dist/components/ThemeSelect.js";
import "/modules/kempo-ui/dist/components/Dialog.js";
import "/modules/kempo-ui/dist/components/Spinner.js";
import "/modules/kempo-ui/dist/components/Toast.js";
import "/modules/kempo-ui/dist/components/Table.js";
```

Key components: `k-card`, `k-toggle`, `k-icon`, `k-tabs`, `k-accordion`, `k-dropdown`, `k-dialog`, `k-theme-switcher`, `k-theme-select`



---

## Icons
Docs: https://dustinpoissant.github.io/kempo-app/#/icons

```html
<k-icon name="settings"></k-icon>
<k-icon name="home" style="width:24px; height:24px"></k-icon>
```

Search order (first match wins): `icons/`  → `node_modules/kempo-app/icons` → `node_modules/kempo-ui/icons`

Find and download icons via CLI:
```sh
npx kempo-listicons arrow   # search by keyword
npx kempo-geticon settings  # download → icons/settings.svg
```

Custom icons: place `name.svg` in `icons/` directory.

---

## Database (window.api.db)
Docs: https://dustinpoissant.github.io/kempo-app/#/database

File-based JSON database. Each table = a separate JSON file. No schema setup needed.

```js
const settings = window.api.db("settings");
await settings.get()            // all keys → { key: value, … }
await settings.get("theme")     // one value
await settings.set("theme", "dark")
await settings.delete("theme")
await settings.has("theme")     // true / false
await settings.clear()          // wipe table
```

Values can be any JSON-serializable type. Tables are auto-created on first write.

Storage location: Windows `%APPDATA%\<appName>\db\*.json` | macOS `~/Library/Application Support/<appName>/db/*.json`

Every `set()` fires a `settingchange` event on `window`:
```js
window.addEventListener("settingchange", e => {
  console.log(e.detail.table, e.detail.key, e.detail.value);
});
```

---

## window.api
Docs: https://dustinpoissant.github.io/kempo-app/#/api

Available in any page fragment or script.

```js
// Window controls
window.api.window.minimize()
window.api.window.maximize()   // toggles maximize/restore
window.api.window.close()
window.api.window.new()        // open new window
window.api.window.new("#/page") // open new window at route

// Platform detection
const platform = await window.api.getPlatform(); // "mac" | "win" | "linux"

// Notifications (use this instead of browser Notification API)
const supported = await window.api.notification.isSupported();
const id = await window.api.notification.show({
  title: "Hello",
  body: "World",
  icon: "media/icon.png",  // optional, defaults to app icon
  silent: false,           // optional
  // subtitle (macOS), urgency (linux), timeoutType (linux/win)
});

// Notification events
window.addEventListener("notification:click", e => console.log(e.detail.id));
window.addEventListener("notification:close", e => console.log(e.detail.id));
window.addEventListener("notification:reply", e => console.log(e.detail.id, e.detail.reply)); // macOS
```

---

## Theming
Docs: https://dustinpoissant.github.io/kempo-app/#/theming

Create `theme.css` in project root to override kempo-css variables. Light/dark handled automatically via `light-dark()`. Hover, active, and inverse variants are **auto-calculated** from base colors using `oklch` — do not set them manually.

```css
/* theme.css */
:root {
  --c_primary:   rgb(71, 132, 143);
  --c_secondary: rgb(153, 51, 255);
  --c_bg:        light-dark(rgb(249,249,249), rgb(51,51,51));
  --c_border:    light-dark(rgb(220,220,220), rgb(80,80,80));
  --tc:          light-dark(rgb(30,30,30), rgb(220,220,220));
  --radius:      0.5rem;
}
```

Themeable variables (only set what you need to override):

| Variable | Controls | Default |
|----------|----------|---------|
| `--c_primary` | Brand color — buttons, links, focus rings | `rgb(51,102,255)` |
| `--c_secondary` | Secondary brand color | `rgb(153,51,255)` |
| `--c_success` | Success state | `rgb(0,136,0)` |
| `--c_warning` | Warning state | `rgb(255,102,0)` |
| `--c_danger` | Danger/error state | `rgb(255,0,51)` |
| `--c_bg` | Page background (light-dark aware) | — |
| `--c_border` | Borders (light-dark aware) | — |
| `--tc` | Base text color (light-dark aware) | — |
| `--tc_muted` | Muted/secondary text | — |
| `--btn_bg` | Default button background | — |
| `--radius` | Border radius | `0.25rem` |
| `--spacer` | Base spacing unit | `1rem` |
| `--fs_base` | Base font size | `16px` |
| `--ff_body` | Body font family | — |
| `--ff_heading` | Heading font family | — |
| `--ff_mono` | Monospace font family | — |
| `--animation_ms` | Transition duration | `256ms` |
| `--container_width` | Max-width for `main`/`.container` | `90rem` |

kempo-css docs: https://dustinpoissant.github.io/kempo-css/
kempo-css llm.txt: https://raw.githubusercontent.com/dustinpoissant/kempo-css/refs/heads/main/llms.txt

### Utility Classes (from kempo-css)

| Need | Class |
|------|-------|
| Flex row | `row` |
| Flex grow | `flex-1`, `flex-2` |
| Padding x/y | `px`, `py`, `pxh`, `pyh`, `pxq`, `pyq` |
| Margin x/y | `mx`, `my`, `mxh`, `myh` |
| Border | `bx`, `by` |
| Background | `bg-default`, `bg-alt`, `bg-secondary` |
| Text color | `tc-default`, `tc-primary`, `tc-muted` |
| Display | `d-f`, `d-b`, `d-n`, `d-g` |
| Full width | `full` |
| Text align | `ta-left`, `ta-center`, `ta-right` |

---

## Backend (backend.js)
Docs: https://dustinpoissant.github.io/kempo-app/#/backend

Runs in Electron's main process. Export a default function:

```js
export default ({ db, ipc, app, Menu }) => {

  // Custom IPC handler
  ipc.handle("my-channel", async (event, data) => {
    const value = db.get("settings", "someKey"); // table name first
    return { result: "ok", value };
  });

  // Deep links — fires when user clicks your-app:// link
  app.on("open-link", url => {
    const parsed = new URL(url);
    console.log(parsed.pathname, parsed.searchParams);
  });

  // File associations — fires when a registered file type is opened
  app.on("open-path", filePath => {
    ipc.emit("file-opened", filePath);
  });

};
```

Call custom IPC from renderer: use Electron's `ipcRenderer` (not exposed by default — if needed, extend `preload.cjs`).

---

## LLM Interact Tools (AI Dev)
Docs: https://dustinpoissant.github.io/kempo-app/#/ai-dev

Run the app in dev mode, then use `kempo-interact` to inspect and drive it live:

```sh
npm run dev   # start app with CDP on port 9222

npm run interact -- structure          # buttons, inputs, links on current page
npm run interact -- dom                # full page HTML
npm run interact -- screenshot         # save screenshot.png
npm run interact -- navigate /settings # navigate to route
npm run interact -- click "#selector"  # click element
npm run interact -- click-text "Save"  # click by text content
npm run interact -- type "#input" "value"
npm run interact -- eval "await window.api.db('settings').get()"
npm run interact -- eval "window.route"
npm run interact -- title
npm run interact -- url
```

Always run `structure` or `dom` first to understand the page before interacting.

---

## Minimal Working Example

**package.json**
```json
{
  "name": "my-app",
  "appName": "My App",
  "appIcon": "media/icon.png",
  "scripts": {
    "start": "kempo-app",
    "dev": "kempo-app --dev",
    "interact": "kempo-interact"
  },
  "dependencies": {
    "kempo-app": "latest"
  }
}
```

**shell.html**
```html
<nav>
  <a href="#/">Home</a>
  <a href="#/settings">Settings</a>
</nav>
<app-page></app-page>
```

**pages/index.html**
```html
<h1>Welcome</h1>
<p>Hello from kempo-app!</p>
```

**pages/settings.html**
```html
<h1>Settings</h1>
<app-setting-bool setting="notifications">Enable Notifications</app-setting-bool>
<k-theme-select>Theme:</k-theme-select>
```

**app.js**
```js
import "/modules/kempo-ui/dist/components/ThemeSelect.js";
```

---

## Full Docs

- Overview: https://dustinpoissant.github.io/kempo-app/
- Routing: https://dustinpoissant.github.io/kempo-app/#/routing
- Components: https://dustinpoissant.github.io/kempo-app/#/components
- Icons: https://dustinpoissant.github.io/kempo-app/#/icons
- Theming: https://dustinpoissant.github.io/kempo-app/#/theming
- API: https://dustinpoissant.github.io/kempo-app/#/api
- Database: https://dustinpoissant.github.io/kempo-app/#/database
- Backend: https://dustinpoissant.github.io/kempo-app/#/backend
- AI Dev: https://dustinpoissant.github.io/kempo-app/#/ai-dev
- kempo-ui: https://dustinpoissant.github.io/kempo-ui/
- kempo-css: https://dustinpoissant.github.io/kempo-css/
