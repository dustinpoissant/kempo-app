import ShadowComponent from "/modules/kempo-ui/dist/components/ShadowComponent.js";
import { css } from "/modules/kempo-ui/dist/lit-all.min.js";

class AppSetting extends ShadowComponent {
  static styles = css`:host { display: flex; justify-content: space-between; align-items: center; }`;

  static properties = {
    setting: { type: String },
    value: {},
    hasLabel: { state: true },
  };

  onSlotChange = e => {
    this.hasLabel = e.target.assignedNodes({ flatten: true }).length > 0;
  };

  #loaded = false;

  constructor() {
    super();
    this.setting = "";
    this.value = undefined;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.value = await window.api.jsonDB("settings").get(this.setting);
    this.#loaded = true;
  }

  updated(changed) {
    if(this.#loaded && changed.has("value")){
      window.api.jsonDB("settings").set(this.setting, this.value);
    }
  }
}

export default AppSetting;
