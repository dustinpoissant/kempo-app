import t from"./Control.js";import{html as a,css as e}from"../../lit-all.min.js";import"../Icon.js";const s=["javascript","typescript","html","css","json","markdown","python","java","csharp","cpp","go","rust","php","ruby","sql","xml","yaml","shell","plaintext"];export default class r extends t{static requires=["setLanguage"];static hostMode="code";static hostEvents=["language-changed"];static properties={...t.properties,value:{type:String,state:!0}};constructor(){super(),this.value="javascript"}connectedCallback(){super.connectedCallback(),this.host&&(this.value=this.host.language||"javascript")}willUpdate(t){super.willUpdate?.(t),this.host&&(this.value=this.host.language||"javascript")}handleChange=t=>{this.host?.setLanguage?.(t.target.value)};static styles=[t.styles,e`
      :host {
        background-color: var(--input_bg);
        color: var(--input_tc);
        border: var(--input_border_width) solid var(--c_input_border);
        border-radius: var(--radius);
        transition: box-shadow var(--animation_ms);
        margin-right: var(--spacer_q);
      }
      select {
        border: 0;
        padding: var(--spacer_h) var(--spacer);
        min-height: 2.5rem;
      }
    `];render(){return a`
      <select .value=${this.value} @change=${this.handleChange} title="Language">
        ${s.map(t=>a`
          <option value="${t}" ?selected=${this.value===t}>${t}</option>
        `)}
      </select>
    `}}customElements.define("kc-language",r);