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

  'app-page persistScroll defaults to true': ({ pass, fail }) => {
    const el = document.createElement("app-page");
    if(el.persistScroll === true) pass();
    else fail(`Expected true, got "${el.persistScroll}"`);
  },

  'app-page persist-scroll="false" sets persistScroll to false': async ({ pass, fail }) => {
    const el = document.createElement("app-page");
    el.setAttribute("persist-scroll", "false");
    document.body.appendChild(el);
    await el.updateComplete;
    if(el.persistScroll === false) pass();
    else fail(`Expected false, got "${el.persistScroll}"`);
  },

  'app-page resets scroll to 0 for new src when persist-scroll is false': async ({ pass, fail }) => {
    const el = document.createElement("app-page");
    el.setAttribute("persist-scroll", "false");
    el.style.overflow = "auto";
    el.style.height = "50px";
    el.src = "/pages/index.html";
    document.body.appendChild(el);
    await el.updateComplete;
    el.scrollTop = 100;
    el.src = "/pages/settings.html";
    await el.updateComplete;
    el.src = "/pages/index.html";
    await el.updateComplete;
    if(el.scrollTop === 0) pass();
    else fail(`Expected scrollTop 0, got ${el.scrollTop}`);
  },
};
