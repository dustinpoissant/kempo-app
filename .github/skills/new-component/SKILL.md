---
name: new-component
description: Creates a new kempo-app framework component — choosing the right base class, writing the source file, registering the custom element, adding documentation, and writing unit tests.
---

# New Component

## When to Use

Use this skill any time you are asked to create a new framework component or add a new custom element to kempo-app's renderer.

---

## Overview

Creating a component involves five steps:

1. **Choose the base component** — pick the right rendering strategy
2. **Write the source file** in `src/renderer/components/`
3. **Register the custom element** at the bottom of the source file
4. **Add documentation** in `example/pages/` (run `npm run build:docs` after)
5. **Write unit tests** in `tests/renderer/components/`

---

## Step 1: Choose the Base Component

Import base classes from kempo-ui via the `/modules/` path:

### `ShadowComponent`
Use when the component needs shadow DOM encapsulation and scoped styles.

```javascript
import { html, css } from "/modules/kempo-ui/dist/lit-all.min.js";
import ShadowComponent from "/modules/kempo-ui/dist/components/ShadowComponent.js";

class MyComponent extends ShadowComponent {
  static styles = css`:host { display: block; }`;

  render() {
    return html`<p>Shadow DOM content</p>`;
  }
}
```

### `LightComponent`
Use when the component renders to the light DOM (no encapsulation, inherits page styles).

```javascript
import { html } from "/modules/kempo-ui/dist/lit-all.min.js";
import LightComponent from "/modules/kempo-ui/dist/components/LightComponent.js";

class MyComponent extends LightComponent {
  renderLightDom() {
    return html`<p>Light DOM content</p>`;
  }
}
```

**Important:** Always call `super.updated()` when overriding `updated()` in `LightComponent`.

---

## Step 2: Write the Source File

Create `src/renderer/components/MyComponent.js`. Follow these conventions:

- **Element naming:** All framework elements use the `app-` prefix (e.g. `app-page`, `app-titlebar`, `app-setting-bool`). Use kebab-case for multi-word names.
- **Import paths:** Always use `/modules/kempo-ui/dist/...` for kempo-ui imports (not relative). These resolve at runtime via the custom protocol.
- Use multi-line comments to separate logical sections: `Lifecycle`, `Event Handlers`, `Rendering`, `Styles`.
- Declare reactive properties with `static properties = { ... }` and initialize defaults in the constructor.
- Use arrow functions for class methods to avoid `.bind(this)`.
- Do not prefix private fields with underscores — use native JS private fields (`#field`) when true privacy is needed.
- The `customElements.define(...)` call goes at the **bottom** of the file, after the class.
- End with `export default MyComponent;`

Example skeleton:

```javascript
import { html, css } from "/modules/kempo-ui/dist/lit-all.min.js";
import ShadowComponent from "/modules/kempo-ui/dist/components/ShadowComponent.js";

class AppMyComponent extends ShadowComponent {
  static properties = {
    value: { type: String },
  };

  /*
    Lifecycle
  */

  constructor() {
    super();
    this.value = "";
  }

  async connectedCallback() {
    super.connectedCallback();
    // async setup
  }

  /*
    Event Handlers
  */

  handleClick = () => {
    this.dispatchEvent(new CustomEvent("my-event", { bubbles: true, composed: true }));
  };

  /*
    Rendering
  */

  render() {
    return html`<button @click=${this.handleClick}>${this.value}</button>`;
  }

  /*
    Styles
  */

  static styles = css`
    :host {
      display: block;
    }
  `;
}

customElements.define("app-my-component", AppMyComponent);

export default AppMyComponent;
```

---

## Step 3: Register in app.js

Framework components that should be auto-available in consumer apps must be imported in `src/renderer/app.js`. Check that file and add an import at the appropriate place.

---

## Step 4: Add Documentation

Documentation pages live in `example/pages/` and are shared with the docs site. After editing, always run:

```powershell
npm run build:docs
```

Use the `highlight-code` skill for all code examples that need syntax highlighting.

---

## Step 5: Write Unit Tests

Create `tests/renderer/components/AppMyComponent.browser-test.js`.

Key conventions:
- Export `export const page = "../test-page.html";` — use the framework test page (not the consumer test page), which maps `/framework/` → `/` and `/modules/` → `/node_modules/`.
- Use `beforeAll` for dynamic imports (never top-level imports — Node parses the file before running it in the browser):
  ```javascript
  export const beforeAll = async () => {
    await import("/framework/src/renderer/components/AppMyComponent.js");
  };
  ```
- Use `beforeEach` to reset DOM and any shared state:
  ```javascript
  export const beforeEach = async () => {
    document.body.innerHTML = "";
  };
  ```
- Export a default plain object where each key is a test description and each value is an `async ({pass, fail}) => {}` function.
- Use `await el.updateComplete` after appending elements to the DOM. Add a short `setTimeout` (50–200ms) before a second `updateComplete` when async side effects (like `window.api` calls) need to settle.

Minimum tests to include:
- Element is defined as a custom element
- Default property values are correct
- Core rendering behavior
- Event dispatching (if applicable)
- `window.api` interaction (if applicable) — the mock is already set up in `testing/mocks.js`

Example skeleton:

```javascript
export const page = "../test-page.html";

export const beforeAll = async () => {
  await import("/framework/src/renderer/components/AppMyComponent.js");
};

export const beforeEach = async () => {
  document.body.innerHTML = "";
};

export default {
  'app-my-component is defined': ({ pass, fail }) => {
    if(customElements.get("app-my-component")) pass();
    else fail("app-my-component not defined");
  },

  'renders correctly': async ({ pass, fail }) => {
    const el = document.createElement("app-my-component");
    document.body.appendChild(el);
    await el.updateComplete;
    if(el.shadowRoot.querySelector("button")) pass();
    else fail("button not found");
  },
};
```

Run tests to confirm they all pass:
```powershell
npm test
```
