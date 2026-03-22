import { html } from "/modules/kempo-ui/dist/lit-all.min.js";
import AppSetting from "./AppSetting.js";

class AppSettingNumber extends AppSetting {
  render() {
    return html`
      ${this.hasLabel
        ? html`<label for=${this.setting}><slot @slotchange=${this.onSlotChange}></slot></label>`
        : html`<slot @slotchange=${this.onSlotChange}></slot>`}
      <input id=${this.setting} type="number" .value=${this.value ?? ""} @change=${e => { this.value = Number(e.target.value); }}>
    `;
  }
}

customElements.define("app-setting-number", AppSettingNumber);

export default AppSettingNumber;
