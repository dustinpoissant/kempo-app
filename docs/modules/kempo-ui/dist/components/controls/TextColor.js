import e from"./Control.js";import{html as o,css as t}from"../../lit-all.min.js";import"../Dropdown.js";import"../Icon.js";export default class r extends e{static requires=["setTextColor"];static hostMode="visual";static properties={...e.properties,colors:{type:String},disableRemove:{type:Boolean,attribute:"disable-remove"},disablePicker:{type:Boolean,attribute:"disable-picker"}};constructor(){super(),this.colors="#000000,#e60000,#ff9900,#ffff00,#008a00,#0066cc,#9933ff,#ffffff,#facccc,#ffebcc,#ffffcc,#cce8cc,#cce0f5,#ebd6ff",this.disableRemove=!1,this.disablePicker=!1}get opened(){return this.shadowRoot?.querySelector("k-dropdown")?.opened??!1}set opened(e){const o=this.shadowRoot?.querySelector("k-dropdown");o&&(o.opened=e)}handleRemove=()=>{this.host?.removeTextColor?.(),this.shadowRoot.querySelector("k-dropdown")?.close()};handleSwatch=e=>{const o=e.target.style.backgroundColor;if(!o)return;const t=o.match(/\d+/g),r=t?"#"+t.map(e=>parseInt(e).toString(16).padStart(2,"0")).join(""):o;this.host?.setTextColor?.(r),this.shadowRoot.querySelector("k-dropdown")?.close()};handlePicker=e=>{this.host?.setTextColor?.(e.target.value),this.shadowRoot.querySelector("k-dropdown")?.close()};render(){const e=this.colors.split(",").map(e=>e.trim()).filter(Boolean);return o`
      <k-dropdown>
        <button slot="trigger" class="trigger" title="Text Color">
          <k-icon name="format_color_text"></k-icon>
        </button>
        <div class="content">
          ${this.disableRemove?"":o`<button class="remove" @click=${this.handleRemove}>Remove Color</button>`}
          <div class="swatches">
            ${e.map(e=>o`<button class="swatch" style="background-color:${e}" @click=${this.handleSwatch}></button>`)}
          </div>
          ${this.disablePicker?"":o`
            <div class="picker"><label>Custom:</label><input type="color" @input=${this.handlePicker} /></div>
          `}
        </div>
      </k-dropdown>
    `}static styles=[e.styles,t`
      :host { border: 1px solid var(--c_border); border-radius: var(--radius); margin: var(--spacer_q); }
      .trigger { min-width: 2.5rem; min-height: 2.5rem; background: transparent; border: none; cursor: pointer; }
      .content { padding: 8px; min-width: 200px; }
      .remove { width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid var(--c_border); background: transparent; cursor: pointer; border-radius: var(--radius); }
      .swatches { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; }
      .swatch { width: 32px; height: 32px; border: 1px solid var(--c_border); cursor: pointer; border-radius: 4px; }
      .swatch:hover { box-shadow: 0 0 4px rgba(0,122,204,0.3); }
      .picker { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
      .picker input { flex: 1; height: 32px; border: 1px solid var(--c_border); border-radius: 4px; cursor: pointer; }
    `]}customElements.define("kc-text-color",r);