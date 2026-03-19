export const page = "../test-page.html";

export const beforeAll = async () => {
  await import("/framework/src/renderer/components/AppPage.js");
};

export const beforeEach = async () => {
  document.body.innerHTML = "";
};

export default {
  'app-page is defined as a custom element': ({ pass, fail }) => {
    if(customElements.get("app-page")) pass();
    else fail("app-page not defined");
  },

  'app-page renders a k-import element': async ({ pass, fail }) => {
    const el = document.createElement("app-page");
    el.src = "/pages/index.html";
    document.body.appendChild(el);
    await el.updateComplete;
    const kImport = el.querySelector("k-import");
    if(kImport) pass();
    else fail("k-import not found inside app-page");
  },

  'app-page passes src to k-import': async ({ pass, fail }) => {
    const el = document.createElement("app-page");
    el.src = "/pages/settings.html";
    document.body.appendChild(el);
    await el.updateComplete;
    const kImport = el.querySelector("k-import");
    if(kImport && kImport.getAttribute("src") === "/pages/settings.html") pass();
    else fail(`Expected src="/pages/settings.html", got "${kImport?.getAttribute("src")}"`);
  },

  'app-page updates k-import src when changed': async ({ pass, fail }) => {
    const el = document.createElement("app-page");
    el.src = "/pages/home.html";
    document.body.appendChild(el);
    await el.updateComplete;
    el.src = "/pages/settings.html";
    await el.updateComplete;
    const kImport = el.querySelector("k-import");
    if(kImport?.getAttribute("src") === "/pages/settings.html") pass();
    else fail("k-import src not updated");
  },

  'app-page has src property': ({ pass, fail }) => {
    const el = document.createElement("app-page");
    if("src" in el) pass();
    else fail("src property missing");
  },

  'app-page default src is empty string': ({ pass, fail }) => {
    const el = document.createElement("app-page");
    if(el.src === "") pass();
    else fail(`Expected empty string, got "${el.src}"`);
  },
};
