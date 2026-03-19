import { html } from "/modules/kempo-ui/dist/lit-all.min.js";
import LightComponent from "/modules/kempo-ui/dist/components/LightComponent.js";
import "/modules/kempo-ui/dist/components/Import.js";

class AppPage extends LightComponent {
  static properties = {
    src: { type: String },
  };

  constructor() {
    super();
    this.src = "";
  }

  render() {
    return html`<k-import src=${this.src}></k-import>`;
  }
}

window.customElements.define("app-page", AppPage);

export default AppPage;
