import { html } from "/modules/kempo-ui/dist/lit-all.min.js";
import ShadowComponent from "/modules/kempo-ui/dist/components/ShadowComponent.js";
import { sharedStyles, sharedProperties, evaluate } from "../utils/visibility.js";

class AppHide extends ShadowComponent {
  static properties = sharedProperties;

  constructor(){
    super();
    this.platform = "";
    this.dev = null;
    this.theme = "";
    this.maximized = null;
    this.setting = "";
  }

  async connectedCallback(){
    super.connectedCallback();
    this.hidden = await evaluate(this);
    if(this.maximized !== null) window.api.window.onMaximizeChange(async () => { this.hidden = await evaluate(this); });
    if(this.theme) new MutationObserver(async () => { this.hidden = await evaluate(this); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if(this.setting) window.addEventListener("settingchange", async () => { this.hidden = await evaluate(this); });
  }

  static styles = sharedStyles;
  render(){ return html`<slot></slot>`; }
}

customElements.define("app-hide", AppHide);

export default AppHide;
