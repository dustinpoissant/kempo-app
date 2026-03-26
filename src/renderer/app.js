import "/modules/kempo-ui/dist/components/Icon.js";
import "/modules/kempo-ui/dist/components/Import.js";
import "/framework/src/renderer/components/AppTitlebar.js";
import "/framework/src/renderer/components/AppPage.js";
import "/framework/src/renderer/components/AppShow.js";
import "/framework/src/renderer/components/AppHide.js";
import "/framework/src/renderer/components/AppSettingBool.js";
import "/framework/src/renderer/components/AppSettingString.js";
import "/framework/src/renderer/components/AppSettingNumber.js";

/*
  Platform
*/

const platform = await window.api.getPlatform();
document.documentElement.dataset.platform = platform;

/*
  App Shell
*/

const shellFile = new URLSearchParams(window.location.search).get("shell") || "shell.html";
const titlebarFile = new URLSearchParams(window.location.search).get("titlebar") || "titlebar.html";
const pagesDir = new URLSearchParams(window.location.search).get("pages") || "pages";

const inject = async (url, fallback) => {
  let res = await fetch(url);
  if(!res.ok && fallback) res = await fetch(fallback);
  if(!res.ok) return;
  const div = document.createElement("div");
  div.innerHTML = await res.text();
  for(const old of div.querySelectorAll("script")){
    const script = document.createElement("script");
    for(const attr of old.attributes) script.setAttribute(attr.name, attr.value);
    script.textContent = old.textContent;
    old.replaceWith(script);
  }
  document.body.append(...div.childNodes);
};

if(titlebarFile !== "false") await inject(`/${titlebarFile}`, "/framework/src/renderer/defaults/titlebar.html");
await inject(`/${shellFile}`, "/framework/src/renderer/defaults/shell.html");
try { await import("/app.js"); } catch {}

document.title = await window.api.getAppName();

/*
  Router
*/

const pageContainer = document.querySelector("app-page");

const parseHash = hash => {
  const raw = hash.slice(1) || "/";
  const [pathPart, queryPart] = raw.split("?");
  const params = Object.fromEntries(new URLSearchParams(queryPart || ""));
  return { path: pathPart || "/", params };
};

const navigate = () => {
  const { path, params } = parseHash(window.location.hash);
  window.route = { path, params };
  const page = path === "/" ? "index" : path.slice(1);
  pageContainer.setAttribute("src", `/${pagesDir}/${page}.html`);
  window.dispatchEvent(new CustomEvent("routechange", { detail: window.route }));
};

window.addEventListener("hashchange", navigate);
navigate();
