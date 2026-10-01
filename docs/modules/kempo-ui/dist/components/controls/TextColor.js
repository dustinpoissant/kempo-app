import e from"./Control.js";import{html as r,css as o}from"../../lit-all.min.js";import"../Dropdown.js";import"../Icon.js";export default class t extends e{static requires=["setTextColor"];static hostMode="visual";static properties={...e.properties,colors:{type:String},disableRemove:{type:Boolean,attribute:"disable-remove"},disablePicker:{type:Boolean,attribute:"disable-picker"}};constructor(){super(),this.colors="#000000,#e60000,#ff9900,#ffff00,#008a00,#0066cc,#9933ff,#ffffff,#facccc,#ffebcc,#ffffcc,#cce8cc,#cce0f5,#ebd6ff",this.disableRemove=!1,this.disablePicker=!1}get opened(){return this.shadowRoot?.querySelector("k-dropdown")?.opened??!1}set opened(e){const r=this.shadowRoot?.querySelector("k-dropdown");r&&(r.opened=e)}handleRemove=()=>{this.host?.removeTextColor?.(),this.shadowRoot.querySelector("k-dropdown")?.close()};handleSwatch=e=>{const r=e.target.style.backgroundColor;if(!r)return;const o=r.match(/\d+/g),t=o?"#"+o.map(e=>parseInt(e).toString(16).padStart(2,"0")).join(""):r;this.host?.setTextColor?.(t),this.shadowRoot.querySelector("k-dropdown")?.close()};handlePicker=e=>{this.host?.setTextColor?.(e.target.value),this.shadowRoot.querySelector("k-dropdown")?.close()};render(){const e=this.colors.split(",").map(e=>e.trim()).filter(Boolean);return r`
      <k-dropdown>
        <button slot="trigger" class="no-btn trigger" title="Text Color">
          <k-icon name="format_color_text"></k-icon>
        </button>
        <div class="content">
          ${this.disableRemove?"":r`<button class="remove" @click=${this.handleRemove}>Remove Color</button>`}
          <div class="swatches">
            ${e.map(e=>r`<button class="swatch" style="background-color:${e}" @click=${this.handleSwatch}></button>`)}
          </div>
          ${this.disablePicker?"":r`
            <div class="picker"><label>Custom:</label><input type="color" @input=${this.handlePicker} /></div>
          `}
        </div>
      </k-dropdown>
    `}static styles=[e.styles,o`
      :host { border: 1px solid var(--c_border); border-radius: var(--radius); margin: var(--spacer_q); }
      .trigger { display: inline-flex; align-items: center; justify-content: center; min-width: 2rem; min-height: 2rem; padding: var(--spacer_h); background: transparent; border: none; border-radius: var(--radius); cursor: pointer; }
      .trigger:hover { background: oklch(from var(--c_bg__inv) l c h / 0.15); }
      .content { padding: 8px; min-width: 200px; }
      .remove { width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid var(--c_border); background: transparent; cursor: pointer; border-radius: var(--radius); }
      .swatches { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; }
      .swatch { width: 32px; height: 32px; border: 1px solid var(--c_border); cursor: pointer; border-radius: 4px; }
      .swatch:hover { box-shadow: 0 0 4px rgba(0,122,204,0.3); }
      .picker { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
      .picker input { flex: 1; height: 32px; border: 1px solid var(--c_border); border-radius: 4px; cursor: pointer; }
    `]}customElements.define("kc-text-color",t);