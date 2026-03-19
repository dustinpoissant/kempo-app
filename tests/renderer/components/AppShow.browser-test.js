export const page = "../test-page.html";

export const beforeAll = async () => {
  await import("/framework/src/renderer/components/AppShow.js");
};

export const beforeEach = async () => {
  document.body.innerHTML = "";
  await window.api.db.clear();
  document.documentElement.removeAttribute("data-theme");
};

export default {
  'app-show is defined as a custom element': ({ pass, fail }) => {
    if(customElements.get("app-show")) pass();
    else fail("app-show not defined");
  },

  'app-show renders slot content': async ({ pass, fail }) => {
    const el = document.createElement("app-show");
    el.innerHTML = "<span>test content</span>";
    document.body.appendChild(el);
    await el.updateComplete;
    const slot = el.shadowRoot.querySelector("slot");
    if(slot) pass();
    else fail("slot not found in app-show");
  },

  'app-show shows when platform matches': async ({ pass, fail }) => {
    const el = document.createElement("app-show");
    el.setAttribute("platform", "win");
    el.innerHTML = "<span>visible</span>";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === false) pass();
    else fail(`Expected hidden=false, got ${el.hidden}`);
  },

  'app-show hides when platform does not match': async ({ pass, fail }) => {
    const el = document.createElement("app-show");
    el.setAttribute("platform", "mac");
    el.innerHTML = "<span>hidden</span>";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === true) pass();
    else fail(`Expected hidden=true, got ${el.hidden}`);
  },

  'app-show shows when dev matches': async ({ pass, fail }) => {
    const el = document.createElement("app-show");
    el.setAttribute("dev", "false");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === false) pass();
    else fail(`Expected hidden=false for dev=false, got ${el.hidden}`);
  },

  'app-show hides when dev does not match': async ({ pass, fail }) => {
    const el = document.createElement("app-show");
    el.setAttribute("dev", "true");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === true) pass();
    else fail(`Expected hidden=true for dev=true (not in dev mode), got ${el.hidden}`);
  },

  'app-show shows when theme matches': async ({ pass, fail }) => {
    document.documentElement.setAttribute("data-theme", "dark");
    const el = document.createElement("app-show");
    el.setAttribute("theme", "dark");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === false) pass();
    else fail(`Expected hidden=false for matching theme, got ${el.hidden}`);
  },

  'app-show hides when theme does not match': async ({ pass, fail }) => {
    document.documentElement.setAttribute("data-theme", "light");
    const el = document.createElement("app-show");
    el.setAttribute("theme", "dark");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === true) pass();
    else fail(`Expected hidden=true for non-matching theme, got ${el.hidden}`);
  },

  'app-show shows when setting key=value matches': async ({ pass, fail }) => {
    await window.api.db.set("mode", "compact");
    const el = document.createElement("app-show");
    el.setAttribute("setting", "mode=compact");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === false) pass();
    else fail(`Expected hidden=false for matching setting, got ${el.hidden}`);
  },

  'app-show hides when setting key=value does not match': async ({ pass, fail }) => {
    await window.api.db.set("mode", "full");
    const el = document.createElement("app-show");
    el.setAttribute("setting", "mode=compact");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === true) pass();
    else fail(`Expected hidden=true for non-matching setting, got ${el.hidden}`);
  },

  'app-show hides when no conditions set': async ({ pass, fail }) => {
    const el = document.createElement("app-show");
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.hidden === true) pass();
    else fail(`Expected hidden=true when no conditions are set, got ${el.hidden}`);
  },

  'app-show uses display:contents when visible': async ({ pass, fail }) => {
    const styles = customElements.get("app-show").styles;
    const cssText = Array.isArray(styles) ? styles.map(s => s.cssText).join("") : styles.cssText;
    if(cssText.includes("display: contents") || cssText.includes("display:contents")) pass();
    else fail("display:contents not found in styles");
  },
};
