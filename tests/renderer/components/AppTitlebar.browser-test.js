export const page = "../test-page.html";

export const beforeAll = async () => {
  await import("/framework/src/renderer/components/AppTitlebar.js");
};

export const beforeEach = async () => {
  document.body.innerHTML = "";
};

export default {
  'app-titlebar is defined as a custom element': ({ pass, fail }) => {
    if(customElements.get("app-titlebar")) pass();
    else fail("app-titlebar not defined");
  },

  'app-titlebar renders title from window.api.getAppName': async ({ pass, fail }) => {
    const el = document.createElement("app-titlebar");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;
    const title = el.shadowRoot.querySelector("#title");
    if(title && title.textContent === "Test App") pass();
    else fail(`Expected "Test App", got "${title?.textContent}"`);
  },

  'app-titlebar sets platform from window.api.getPlatform': async ({ pass, fail }) => {
    const el = document.createElement("app-titlebar");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;
    if(el.platform === "win") pass();
    else fail(`Expected "win", got "${el.platform}"`);
  },

  'app-titlebar renders window controls on non-mac platform': async ({ pass, fail }) => {
    const el = document.createElement("app-titlebar");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;
    const controls = el.shadowRoot.querySelector("#window-controls");
    if(controls) pass();
    else fail("Window controls not found for win platform");
  },

  'app-titlebar has minimize button': async ({ pass, fail }) => {
    const el = document.createElement("app-titlebar");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('[aria-label="Minimize"]');
    if(btn) pass();
    else fail("Minimize button not found");
  },

  'app-titlebar has maximize button': async ({ pass, fail }) => {
    const el = document.createElement("app-titlebar");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('[aria-label="Maximize"]');
    if(btn) pass();
    else fail("Maximize button not found");
  },

  'app-titlebar has close button': async ({ pass, fail }) => {
    const el = document.createElement("app-titlebar");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('[aria-label="Close"]');
    if(btn) pass();
    else fail("Close button not found");
  },

  'app-titlebar does not render mac-spacer for win': async ({ pass, fail }) => {
    const el = document.createElement("app-titlebar");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;
    const spacer = el.shadowRoot.querySelector("#mac-spacer");
    if(!spacer) pass();
    else fail("mac-spacer should not render on win platform");
  },

  'app-titlebar renders mac-spacer for mac platform': async ({ pass, fail }) => {
    const origGetPlatform = window.api.getPlatform;
    window.api.getPlatform = async () => "mac";
    const el = document.createElement("app-titlebar");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;
    const spacer = el.shadowRoot.querySelector("#mac-spacer");
    window.api.getPlatform = origGetPlatform;
    if(spacer) pass();
    else fail("mac-spacer not rendered for mac platform");
  },

  'app-titlebar has draggable region style': async ({ pass, fail }) => {
    const el = document.createElement("app-titlebar");
    document.body.appendChild(el);
    await el.updateComplete;
    const host = el.shadowRoot.host;
    const styles = el.constructor.styles;
    const cssText = Array.isArray(styles) ? styles.map(s => s.cssText).join("") : styles.cssText;
    if(cssText.includes("-webkit-app-region: drag")) pass();
    else fail("Draggable region style not found");
  },

  'app-titlebar has slot elements': async ({ pass, fail }) => {
    const el = document.createElement("app-titlebar");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    await el.updateComplete;
    const slots = el.shadowRoot.querySelectorAll("slot");
    if(slots.length >= 2) pass();
    else fail(`Expected at least 2 slots, got ${slots.length}`);
  },
};
