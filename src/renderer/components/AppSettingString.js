import { html } from "/modules/kempo-ui/dist/lit-all.min.js";
import AppSetting from "./AppSetting.js";

class AppSettingString extends AppSetting {
  render() {
    return html`
      ${this.hasLabel
        ? html`<label for=${this.setting}><slot @slotchange=${this.onSlotChange}></slot></label>`
        : html`<slot @slotchange=${this.onSlotChange}></slot>`}
      <input id=${this.setting} type="text" .value=${this.value || ""} @change=${e => { this.value = e.target.value; }}>
    `;
  }
}

customElements.define("app-setting-string", AppSettingString);

export default AppSettingString;
