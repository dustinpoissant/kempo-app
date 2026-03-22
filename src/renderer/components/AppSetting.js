import ShadowComponent from "/modules/kempo-ui/dist/components/ShadowComponent.js";

class AppSetting extends ShadowComponent {
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
    this.value = await window.api.db("settings").get(this.setting);
    this.#loaded = true;
  }

  updated(changed) {
    if(this.#loaded && changed.has("value")){
      window.api.db("settings").set(this.setting, this.value);
    }
  }
}

export default AppSetting;
