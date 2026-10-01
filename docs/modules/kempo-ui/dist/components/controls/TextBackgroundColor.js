import r from"./Control.js";import{html as e,css as o}from"../../lit-all.min.js";import"../Dropdown.js";import"../Icon.js";export default class t extends r{static requires=["setTextBackgroundColor"];static hostMode="visual";static properties={...r.properties,colors:{type:String},disableRemove:{type:Boolean,attribute:"disable-remove"},disablePicker:{type:Boolean,attribute:"disable-picker"}};constructor(){super(),this.colors="#ffff00,#00ffff,#ff66ff,#99ff99,#ffcc99,#ff9999,#cccccc,#ffffff,#ffffcc,#ccffff,#ffccff,#ccffcc",this.disableRemove=!1,this.disablePicker=!1}get opened(){return this.shadowRoot?.querySelector("k-dropdown")?.opened??!1}set opened(r){const e=this.shadowRoot?.querySelector("k-dropdown");e&&(e.opened=r)}handleRemove=()=>{this.host?.removeTextBackgroundColor?.(),this.shadowRoot.querySelector("k-dropdown")?.close()};handleSwatch=r=>{const e=r.target.style.backgroundColor;if(!e)return;const o=e.match(/\d+/g),t=o?"#"+o.map(r=>parseInt(r).toString(16).padStart(2,"0")).join(""):e;this.host?.setTextBackgroundColor?.(t),this.shadowRoot.querySelector("k-dropdown")?.close()};handlePicker=r=>{this.host?.setTextBackgroundColor?.(r.target.value),this.shadowRoot.querySelector("k-dropdown")?.close()};render(){const r=this.colors.split(",").map(r=>r.trim()).filter(Boolean);return e`
      <k-dropdown>
        <button slot="trigger" class="no-btn trigger" title="Highlight Color">
          <k-icon name="format_color_fill"></k-icon>
        </button>
        <div class="content">
          ${this.disableRemove?"":e`<button class="remove" @click=${this.handleRemove}>Remove Color</button>`}
          <div class="swatches">
            ${r.map(r=>e`<button class="swatch" style="background-color:${r}" @click=${this.handleSwatch}></button>`)}
          </div>
          ${this.disablePicker?"":e`
            <div class="picker"><label>Custom:</label><input type="color" @input=${this.handlePicker} /></div>
          `}
        </div>
      </k-dropdown>
    `}static styles=[r.styles,o`
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
    `]}customElements.define("kc-text-background-color",t);