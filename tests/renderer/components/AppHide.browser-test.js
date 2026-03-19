export const page = "../test-page.html";

export const beforeAll = async () => {
  await import("/framework/src/renderer/components/AppHide.js");
};

export const beforeEach = async () => {
  document.body.innerHTML = "";
  await window.api.db.clear();
  document.documentElement.removeAttribute("data-theme");
};

export default {
  'app-hide is defined as a custom element': ({ pass, fail }) => {
    if(customElements.get("app-hide")) pass();
    else fail("app-hide not defined");
  },

  'app-hide renders slot content': async ({ pass, fail }) => {
    const el = document.createElement("app-hide");
    el.innerHTML = "<span>test content</span>";
    document.body.appendChild(el);
    await el.updateComplete;
    const slot = el.shadowRoot.querySelector("slot");
    if(slot) pass();
    else fail("slot not found in app-hide");
  },

  'app-hide hides when platform matches': async ({ pass, fail }) => {
    const el = document.createElement("app-hide");
    el.setAttribute("platform", "win");
    el.innerHTML = "<span>hidden</span>";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === true) pass();
    else fail(`Expected hidden=true, got ${el.hidden}`);
  },

  'app-hide shows when platform does not match': async ({ pass, fail }) => {
    const el = document.createElement("app-hide");
    el.setAttribute("platform", "mac");
    el.innerHTML = "<span>visible</span>";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === false) pass();
    else fail(`Expected hidden=false, got ${el.hidden}`);
  },

  'app-hide hides when dev matches': async ({ pass, fail }) => {
    const el = document.createElement("app-hide");
    el.setAttribute("dev", "false");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === true) pass();
    else fail(`Expected hidden=true for dev=false, got ${el.hidden}`);
  },

  'app-hide shows when dev does not match': async ({ pass, fail }) => {
    const el = document.createElement("app-hide");
    el.setAttribute("dev", "true");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === false) pass();
    else fail(`Expected hidden=false for dev=true (not dev mode), got ${el.hidden}`);
  },

  'app-hide hides when theme matches': async ({ pass, fail }) => {
    document.documentElement.setAttribute("data-theme", "dark");
    const el = document.createElement("app-hide");
    el.setAttribute("theme", "dark");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === true) pass();
    else fail(`Expected hidden=true for matching theme, got ${el.hidden}`);
  },

  'app-hide shows when theme does not match': async ({ pass, fail }) => {
    document.documentElement.setAttribute("data-theme", "light");
    const el = document.createElement("app-hide");
    el.setAttribute("theme", "dark");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === false) pass();
    else fail(`Expected hidden=false for non-matching theme, got ${el.hidden}`);
  },

  'app-hide hides when setting key=value matches': async ({ pass, fail }) => {
    await window.api.db.set("mode", "compact");
    const el = document.createElement("app-hide");
    el.setAttribute("setting", "mode=compact");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === true) pass();
    else fail(`Expected hidden=true for matching setting, got ${el.hidden}`);
  },

  'app-hide uses display:contents when visible': async ({ pass, fail }) => {
    const el = document.createElement("app-hide");
    el.setAttribute("platform", "mac");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    const styles = el.constructor.styles;
    const cssText = Array.isArray(styles) ? styles.map(s => s.cssText).join("") : styles.cssText;
    if(cssText.includes("display: contents") || cssText.includes("display:contents")) pass();
    else fail("display:contents not found in styles");
  },
};
