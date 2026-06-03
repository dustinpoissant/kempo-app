import t from"./Control.js";import{html as e,css as o}from"../../lit-all.min.js";import"../Icon.js";export default class r extends t{static requires=["setEditorTheme"];static hostMode="code";static hostEvents=["editor-theme-changed"];static properties={...t.properties,value:{type:String,state:!0}};constructor(){super(),this.value="auto"}connectedCallback(){super.connectedCallback(),this.host&&(this.value=this.host.editorTheme||"auto")}willUpdate(t){super.willUpdate?.(t),this.host&&(this.value=this.host.editorTheme||"auto")}handleChange=t=>{this.host?.setEditorTheme?.(t.target.value)};static styles=[t.styles,o`
      :host {
        position: relative;
        background-color: var(--input_bg);
        color: var(--input_tc);
        border: var(--input_border_width) solid var(--c_input_border);
        border-radius: var(--radius);
        transition: box-shadow var(--animation_ms);
        margin-right: var(--spacer_q);
      }
      k-icon {
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
      }
      select {
        border: 0;
        padding: var(--spacer_h) 1rem var(--spacer_h) 2rem;
        min-height: 2.5rem;
      }
    `];render(){return e`
      <k-icon name="contrast"></k-icon>
      <select .value=${this.value} @change=${this.handleChange} title="Editor Theme">
        <option value="auto">Auto</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    `}}customElements.define("kc-editor-theme",r);