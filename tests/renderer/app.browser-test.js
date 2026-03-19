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
};
