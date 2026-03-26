# kempo-app

An [Electron](https://www.electronjs.org/) desktop app framework built on [kempo-ui](https://github.com/dustinpoissant/kempo-ui) and [kempo-css](https://github.com/dustinpoissant/kempo-css). Create a few files, run one command, and you have a native desktop app with a custom titlebar, SPA routing, persistent databases, and a full component library — no boilerplate required.

**[Documentation →](https://dustinpoissant.github.io/kempo-app/)**

---

## Quick Start

```sh
npm install kempo-app
```

Create `pages/index.html` — the only file required:

```html
<h1>Hello World</h1>
```

Run it:

```sh
npx kempo-app
```

That's it. You have a desktop app.

---

## Optional Files

Every file below is optional. The framework falls back to sensible defaults when they are absent.

| File | Purpose |
|------|---------|
| `shell.html` | App shell — nav bar + `<app-page>` where pages render |
| `titlebar.html` | Custom frameless titlebar with drag, minimize, maximize, close |
| `theme.css` | Override CSS variables to customize colors, spacing, fonts |
| `app.js` | ESM module — import kempo-ui components and run startup logic |
| `backend.js` | Node.js code in Electron's main process (IPC, menus, file system) |
| `init.js` | Runs once on first launch (seed data, one-time setup) |
| `update.js` | Runs when `version` in package.json changes (migrations) |
| `icons/` | Custom SVG icons — override any built-in icon |
| `media/` | App assets (icon.png, images, etc.) |
| `schema/` | Define SQL tables as files — auto-created and auto-migrated |

**[Configuration docs →](https://dustinpoissant.github.io/kempo-app/#/config)**

---

## Routing

Hash routes map directly to files in your `pages/` directory. No config needed.

| URL hash | File loaded |
|----------|-------------|
| `#/` | `pages/index.html` |
| `#/settings` | `pages/settings.html` |
| `#/any-name` | `pages/any-name.html` |

To add a new page: create the file, add a link. That's it.

**[Routing docs →](https://dustinpoissant.github.io/kempo-app/#/routing)**

---

## API

`api` is a global available everywhere — pages, `app.js`, `backend.js`, `init.js`, and `update.js`.

```js
// JSON Database — file-based key/value store, no setup needed
const settings = api.jsonDB("settings");
await settings.set("theme", "dark");
await settings.get("theme");  // "dark"

// SQL Database — requires better-sqlite3
import DB from "/framework/src/renderer/utils/sqlDB.js";
const users = new DB("mydb").table("users");
await users.create({ name: "Alice", email: "alice@example.com" });
const all = await users.getAll();

// Window controls
api.window.minimize();
api.window.maximize();
api.window.close();
api.window.new("#/settings");

// Notifications
await api.notification.show({ title: "Hello", body: "World" });

// Utilities
await api.getPlatform();  // "mac" | "win" | "linux"
await api.getAppName();
await api.isDev();
```

**[API docs →](https://dustinpoissant.github.io/kempo-app/#/api)** · **[Database docs →](https://dustinpoissant.github.io/kempo-app/#/database)**

---

## Components

Built on [kempo-ui](https://dustinpoissant.github.io/kempo-ui/) — a library of Lit-based web components with a `k-` prefix. Import what you need in `app.js`:

```js
import "/modules/kempo-ui/dist/components/Card.js";
import "/modules/kempo-ui/dist/components/Toggle.js";
import "/modules/kempo-ui/dist/components/Tabs.js";
```

The framework also provides `<app-*>` components automatically (no imports needed):

- `<app-titlebar>` — frameless window titlebar
- `<app-page>` — router render target
- `<app-show>` / `<app-hide>` — conditional rendering by platform, theme, dev mode, or setting value
- `<app-setting-bool>` / `<app-setting-string>` / `<app-setting-number>` — persistent settings inputs

**[Components docs →](https://dustinpoissant.github.io/kempo-app/#/components)**

---

## Backend

Three optional files run in Electron's main process:

```js
// backend.js — runs every startup
export default ({ ipc, app, Menu }) => {
  ipc.handle("my-channel", async (e, data) => { /* ... */ });
  app.on("open-link", url => { /* deep link handler */ });
  app.on("open-path", filePath => { /* file association handler */ });
};
```

**[Backend docs →](https://dustinpoissant.github.io/kempo-app/#/backend)**

---

## Icons

SVG icons loaded via `<k-icon name="settings">`. Find and download from Google Material Symbols:

```sh
npx kempo-icon            # interactive search + download
npx kempo-listicons arrow # search by keyword
npx kempo-geticon home    # download → icons/home.svg
```

**[Icons docs →](https://dustinpoissant.github.io/kempo-app/#/icons)**

---

## Theming

Create `theme.css` to override kempo-css variables. Light/dark mode is handled automatically.

```css
:root {
  --c_primary: #47848F;
  --c_bg: light-dark(#f9f9f9, #333);
  --radius: 0.5rem;
}
```

**[Theming docs →](https://dustinpoissant.github.io/kempo-app/#/theming)** · **[kempo-css docs →](https://dustinpoissant.github.io/kempo-css/)**

---

## AI-Assisted Development

Run in dev mode, then use `kempo-interact` to inspect and drive the app:

```sh
npm run dev                              # start with DevTools + CDP
npx kempo-interact structure             # page overview
npx kempo-interact screenshot            # take a screenshot
npx kempo-interact navigate /settings    # navigate to a route
npx kempo-interact eval "await api.jsonDB('settings').get()"
```

**[AI Dev docs →](https://dustinpoissant.github.io/kempo-app/#/ai-dev)**

---

## Testing

```sh
npm install --save-dev kempo-testing-framework
npx kempo-test
```

Write `.browser-test.js` files for component tests (run in a real browser with mocked Electron API) and `.node-test.js` files for pure logic tests.

**[Testing docs →](https://dustinpoissant.github.io/kempo-app/#/testing)**

---

## npm Scripts

Add these to your `package.json`:

```json
"scripts": {
  "start": "kempo-app",
  "dev": "kempo-app --dev",
  "interact": "kempo-interact",
  "test": "npx kempo-test"
}
```

---

## Links

- [Documentation](https://dustinpoissant.github.io/kempo-app/)
- [kempo-ui Components](https://dustinpoissant.github.io/kempo-ui/)
- [kempo-css Styles](https://dustinpoissant.github.io/kempo-css/)
- [GitHub](https://github.com/dustinpoissant/kempo-app)
- [npm](https://www.npmjs.com/package/kempo-app)

## License

MIT
