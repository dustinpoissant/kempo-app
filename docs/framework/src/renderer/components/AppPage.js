import { html } from "/modules/kempo-ui/dist/lit-all.min.js";
import LightComponent from "/modules/kempo-ui/dist/components/LightComponent.js";
import "/modules/kempo-ui/dist/components/Import.js";

class AppPage extends LightComponent {
  static properties = {
    src: { type: String },
    persistScroll: {
      attribute: "persist-scroll",
      converter: v => v !== "false",
    },
  };

  #scrollPositions = new Map();

  constructor() {
    super();
    this.src = "";
    this.persistScroll = true;
    // Marks this as the mount point for portaled overlays (e.g. kempo-ui's
    // PhotoViewer.open()) so they're contained below the titlebar instead of
    // covering it. Paired with `contain: layout` on app-page in app.css.
    this.setAttribute("data-overlay-root", "");
  }

  willUpdate(changed) {
    if(changed.has("src") && changed.get("src")){
      const prev = changed.get("src");
      if(this.persistScroll) this.#scrollPositions.set(prev, this.scrollTop);
      else this.#scrollPositions.delete(prev);
    }
  }

  updated(changed) {
    if(changed.has("src")){
      const saved = this.#scrollPositions.get(this.src) || 0;
      const kImport = this.querySelector("k-import");
      if(!kImport){ this.scrollTop = saved; return; }
      kImport.addEventListener("content-rendered", () => {
        requestAnimationFrame(() => { this.scrollTop = saved; });
      }, { once: true });
    }
  }

  render() {
    return html`<k-import src=${this.src}></k-import>`;
  }
}

window.customElements.define("app-page", AppPage);

export default AppPage;
