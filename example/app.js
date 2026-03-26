import "/modules/kempo-ui/dist/components/Card.js";
import "/modules/kempo-ui/dist/components/Toggle.js";
import "/modules/kempo-ui/dist/components/ThemeSwitcher.js";
import "/modules/kempo-ui/dist/components/ThemeSelect.js";
import "/modules/kempo-ui/dist/components/Accordion.js";
import "/modules/kempo-ui/dist/components/Tabs.js";
import "/modules/kempo-ui/dist/components/Dropdown.js";
import "/modules/kempo-ui/dist/components/Table.js";

/* Nav active indicator */
window.addEventListener("routechange", e => {
  const { path } = e.detail;
  document.querySelectorAll(".nav-link").forEach(link => {
    const linkPath = link.getAttribute("href")?.replace("#", "").split("?")[0];
    link.classList.toggle("active", linkPath === "/" ? path === "/" : path === linkPath || path.startsWith(linkPath + "/"));
  });
});
