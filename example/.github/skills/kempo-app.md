# kempo-app — Copilot Skill

## Project

This is a **kempo-app** Electron desktop app — a frameless window with a hash-based SPA router, flat-file JSON database, and optional Node.js backend hook.

## Project Structure

```
package.json       "appName", "appIcon", "protocolName"
shell.html         App shell — nav bar, <app-page> render target
titlebar.html      Optional — <app-titlebar> with slots for nav and controls
app.js             Optional — ESM, imports kempo-ui components
theme.css          Optional — CSS variable overrides (loaded after kempo-css)
backend.js         Optional — runs in main process
pages/
  index.html       Loaded for #/
  settings.html    Loaded for #/settings
icons/             Custom SVG icons (override kempo-ui icons by same name)
media/             App assets (icon.png, etc.)
```

## Running the App

```sh
npm run dev      # dev mode: DevTools open, CDP on port 9222, Node inspector on 5858
npm start        # production mode
```

## Interact Workflow

Use `npm run interact` to inspect and drive the running app (requires dev mode).
**Always run `structure` first** to understand the page before clicking or typing.

```sh
npm run interact -- structure                            # buttons, inputs, links
npm run interact -- dom                                  # full DOM
npm run interact -- screenshot                           # saves screenshot.png
npm run interact -- navigate /settings                   # go to a page
npm run interact -- click "#some-id"                     # click by selector
npm run interact -- click-text "Save"                    # click by visible text
npm run interact -- type "#input-id" "value"             # type into an input
npm run interact -- eval "await window.api.db.get()"     # run JS in renderer
npm run interact -- eval "window.route"                  # check current route
```

## Router

Hash-based, convention-driven — no config needed.

| Hash | File loaded |
|------|-------------|
| `#/` | `pages/index.html` |
| `#/settings` | `pages/settings.html` |
| `#/any-name` | `pages/any-name.html` |

Query params: `#/settings?tab=appearance` → `window.route.params.tab === "appearance"`

## window.api (Renderer)

```js
await window.api.db.get()              // { key: value, … }
await window.api.db.get("key")         // single value
await window.api.db.set("key", val)
await window.api.db.delete("key")
await window.api.db.has("key")         // true / false
await window.api.db.clear()

window.api.window.minimize()
window.api.window.maximize()           // toggles maximize/restore
window.api.window.close()

const platform = await window.api.getPlatform(); // "mac" | "win" | "linux"
```

## backend.js (Main Process)

```js
export default ({ db, ipc, app, Menu }) => {
  ipc.handle("my-channel", async (event, data) => {
    return { result: "ok" };
  });

  app.on("before-quit", () => { db.set("lastSession", Date.now()); });
  app.on("open-link", url => { /* deep link handler */ });
  app.on("open-path", filePath => { /* file association handler */ });
};
```

## kempo-ui Components (import in app.js)

```js
import "/modules/kempo-ui/dist/components/Card.js";       // <k-card>
import "/modules/kempo-ui/dist/components/Toggle.js";     // <k-toggle>
import "/modules/kempo-ui/dist/components/Tabs.js";       // <k-tabs>
import "/modules/kempo-ui/dist/components/Dropdown.js";   // <k-dropdown>
import "/modules/kempo-ui/dist/components/Dialog.js";     // <k-dialog>
```

Framework components (auto-registered, no import needed):
- `<app-titlebar>` — frameless window titlebar with drag support
- `<app-page>` — hash-router render target (place in shell.html)
- `<app-show platform="mac">` / `<app-hide dev>` — conditional rendering

## kempo-css Conventions

Never write custom CSS for colors, spacing, or layout that kempo-css covers.

| Need | Class |
|------|-------|
| Flex row | `row` |
| Flex grow | `flex-1`, `flex-2` |
| Padding x/y | `px`, `py`, `pxh`, `pyh` |
| Margin | `mx`, `my`, `mxh`, `myh` |
| Background | `bg-default`, `bg-alt` |
| Text color | `tc-default`, `tc-primary`, `tc-muted` |
| Full width | `full` |

Key CSS variables: `--tc`, `--c_bg`, `--c_bg__alt`, `--c_primary`, `--c_border`, `--spacer`, `--radius`
