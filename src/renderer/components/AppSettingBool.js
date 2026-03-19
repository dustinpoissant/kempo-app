import { html } from "/modules/kempo-ui/dist/lit-all.min.js";
import "/modules/kempo-ui/dist/components/Toggle.js";
import AppSetting from "./AppSetting.js";

class AppSettingBool extends AppSetting {
  render() {
    return html`
      <k-toggle .value=${!!this.value} @change=${e => { this.value = e.detail.value; }}><slot></slot></k-toggle>
    `;
  }
}

customElements.define("app-setting-bool", AppSettingBool);

export default AppSettingBool;
