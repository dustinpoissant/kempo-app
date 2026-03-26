export const page = "./test-page.html";

/*
  Test the router logic from app.js
  The parseHash and route logic are tested by reimplementing them here
  since app.js has side effects that require the full app environment
*/

const parseHash = hash => {
  const raw = hash.slice(1) || "/";
  const [pathPart, queryPart] = raw.split("?");
  const params = Object.fromEntries(new URLSearchParams(queryPart || ""));
  return { path: pathPart || "/", params };
};

export default {
  'parseHash: empty hash returns root path': ({ pass, fail }) => {
    const result = parseHash("");
    if(result.path === "/") pass();
    else fail(`Expected "/", got "${result.path}"`);
  },

  'parseHash: # returns root path': ({ pass, fail }) => {
    const result = parseHash("#");
    if(result.path === "/") pass();
    else fail(`Expected "/", got "${result.path}"`);
  },

  'parseHash: #/ returns root path': ({ pass, fail }) => {
    const result = parseHash("#/");
    if(result.path === "/") pass();
    else fail(`Expected "/", got "${result.path}"`);
  },

  'parseHash: #/settings returns /settings': ({ pass, fail }) => {
    const result = parseHash("#/settings");
    if(result.path === "/settings") pass();
    else fail(`Expected "/settings", got "${result.path}"`);
  },

  'parseHash: #/nested/page returns /nested/page': ({ pass, fail }) => {
    const result = parseHash("#/nested/page");
    if(result.path === "/nested/page") pass();
    else fail(`Expected "/nested/page", got "${result.path}"`);
  },

  'parseHash: params are empty when no query string': ({ pass, fail }) => {
    const result = parseHash("#/home");
    if(Object.keys(result.params).length === 0) pass();
    else fail(`Expected empty params, got ${JSON.stringify(result.params)}`);
  },

  'parseHash: parses single query param': ({ pass, fail }) => {
    const result = parseHash("#/settings?tab=appearance");
    if(result.path === "/settings" && result.params.tab === "appearance") pass();
    else fail(`Expected tab=appearance, got ${JSON.stringify(result)}`);
  },

  'parseHash: parses multiple query params': ({ pass, fail }) => {
    const result = parseHash("#/page?a=1&b=2&c=hello");
    if(result.params.a === "1" && result.params.b === "2" && result.params.c === "hello") pass();
    else fail(`Expected a=1, b=2, c=hello, got ${JSON.stringify(result.params)}`);
  },

  'parseHash: path maps to correct page file - root': ({ pass, fail }) => {
    const { path } = parseHash("#/");
    const page = path === "/" ? "index" : path.slice(1);
    if(page === "index") pass();
    else fail(`Expected "index", got "${page}"`);
  },

  'parseHash: path maps to correct page file - named': ({ pass, fail }) => {
    const { path } = parseHash("#/settings");
    const page = path === "/" ? "index" : path.slice(1);
    if(page === "settings") pass();
    else fail(`Expected "settings", got "${page}"`);
  },

  'inject function creates elements from HTML string': async ({ pass, fail }) => {
    const div = document.createElement("div");
    div.innerHTML = '<p id="test-inject">Hello</p>';
    document.body.append(...div.childNodes);
    const el = document.getElementById("test-inject");
    if(el && el.textContent === "Hello") pass();
    else fail("Inject pattern did not work");
    el?.remove();
  },

  'script replacement pattern preserves attributes': async ({ pass, fail }) => {
    const div = document.createElement("div");
    div.innerHTML = '<script type="module" data-test="true">window.__testScriptRan = true;</script>';
    for(const old of div.querySelectorAll("script")){
      const script = document.createElement("script");
      for(const attr of old.attributes) script.setAttribute(attr.name, attr.value);
      script.textContent = old.textContent;
      old.replaceWith(script);
    }
    const script = div.querySelector("script");
    if(script.getAttribute("type") === "module" && script.getAttribute("data-test") === "true") pass();
    else fail("Script attributes not preserved");
  },

  'nav-link active class toggling': ({ pass, fail }) => {
    document.body.innerHTML = `
      <a href="#/" class="nav-link">Home</a>
      <a href="#/settings" class="nav-link">Settings</a>
    `;
    const links = document.querySelectorAll(".nav-link");
    const currentPath = "/settings";
    links.forEach(link => {
      const linkPath = link.getAttribute("href")?.replace("#", "").split("?")[0];
      link.classList.toggle("active", linkPath === currentPath);
    });
    if(!links[0].classList.contains("active") && links[1].classList.contains("active")) pass();
    else fail("Active class not toggled correctly");
    document.body.innerHTML = "";
  },

  /*
    URL search params config
  */

  'config: shell param defaults to shell.html': ({ pass, fail }) => {
    const params = new URLSearchParams("");
    const shellFile = params.get("shell") || "shell.html";
    if(shellFile === "shell.html") pass();
    else fail(`Expected "shell.html", got "${shellFile}"`);
  },

  'config: shell param reads custom value': ({ pass, fail }) => {
    const params = new URLSearchParams("shell=editor-shell.html&titlebar=titlebar.html&pages=pages");
    const shellFile = params.get("shell") || "shell.html";
    if(shellFile === "editor-shell.html") pass();
    else fail(`Expected "editor-shell.html", got "${shellFile}"`);
  },

  'config: titlebar param defaults to titlebar.html': ({ pass, fail }) => {
    const params = new URLSearchParams("");
    const titlebarFile = params.get("titlebar") || "titlebar.html";
    if(titlebarFile === "titlebar.html") pass();
    else fail(`Expected "titlebar.html", got "${titlebarFile}"`);
  },

  'config: titlebar "false" disables titlebar': ({ pass, fail }) => {
    const params = new URLSearchParams("shell=shell.html&titlebar=false&pages=pages");
    const titlebarFile = params.get("titlebar") || "titlebar.html";
    if(titlebarFile === "false") pass();
    else fail(`Expected "false", got "${titlebarFile}"`);
  },

  'config: pages param defaults to pages': ({ pass, fail }) => {
    const params = new URLSearchParams("");
    const pagesDir = params.get("pages") || "pages";
    if(pagesDir === "pages") pass();
    else fail(`Expected "pages", got "${pagesDir}"`);
  },

  'config: pages param reads custom value': ({ pass, fail }) => {
    const params = new URLSearchParams("shell=shell.html&titlebar=titlebar.html&pages=views");
    const pagesDir = params.get("pages") || "pages";
    if(pagesDir === "views") pass();
    else fail(`Expected "views", got "${pagesDir}"`);
  },

  'config: pages dir used in page path - root': ({ pass, fail }) => {
    const pagesDir = "views";
    const path = "/";
    const page = path === "/" ? "index" : path.slice(1);
    const src = `/${pagesDir}/${page}.html`;
    if(src === "/views/index.html") pass();
    else fail(`Expected "/views/index.html", got "${src}"`);
  },

  'config: pages dir used in page path - named': ({ pass, fail }) => {
    const pagesDir = "screens";
    const path = "/settings";
    const page = path === "/" ? "index" : path.slice(1);
    const src = `/${pagesDir}/${page}.html`;
    if(src === "/screens/settings.html") pass();
    else fail(`Expected "/screens/settings.html", got "${src}"`);
  },

  'config: default pages dir produces standard paths': ({ pass, fail }) => {
    const pagesDir = "pages";
    const path = "/about";
    const page = path === "/" ? "index" : path.slice(1);
    const src = `/${pagesDir}/${page}.html`;
    if(src === "/pages/about.html") pass();
    else fail(`Expected "/pages/about.html", got "${src}"`);
  },
};
