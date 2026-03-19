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

await inject("/titlebar.html", "/framework/src/renderer/defaults/titlebar.html");
await inject("/shell.html", "/framework/src/renderer/defaults/shell.html");
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
  pageContainer.setAttribute("src", `/pages/${page}.html`);
  document.querySelectorAll(".nav-link").forEach(link => {
    const linkPath = link.getAttribute("href")?.replace("#", "").split("?")[0];
    link.classList.toggle("active", linkPath === path);
  });
  window.dispatchEvent(new CustomEvent("routechange", { detail: window.route }));
};

window.addEventListener("hashchange", navigate);
navigate();
