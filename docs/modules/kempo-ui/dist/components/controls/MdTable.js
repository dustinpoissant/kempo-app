import e from"./Control.js";import{html as r,css as t}from"../../lit-all.min.js";import"../Icon.js";import"../Dropdown.js";import{bound as o}from"../../utils/number.js";export default class n extends e{static requires=["replaceSelection"];static hostMode="write";handleDropdownOpened=()=>{requestAnimationFrame(()=>{const e=this.shadowRoot.querySelector(".tbl-cols");e&&(e.value="3",e.select());const r=this.shadowRoot.querySelector(".tbl-rows");r&&(r.value="2")})};handleFormKeydown=e=>{"Enter"===e.key?(e.preventDefault(),this.submit()):"Escape"===e.key&&this.shadowRoot.querySelector("k-dropdown")?.close()};submit(){const e=this.clamp(this.shadowRoot.querySelector(".tbl-cols").value,1,20),r=this.clamp(this.shadowRoot.querySelector(".tbl-rows").value,1,50);e&&r&&(this.host?.replaceSelection?.(this.buildTable(e,r),{selectInserted:!1}),this.shadowRoot.querySelector("k-dropdown")?.close())}clamp(e,r,t){const n=parseInt(e,10);return Number.isFinite(n)?o(n,r,t):0}buildTable(e,r){const t=Array.from({length:e},(e,r)=>` Header ${r+1} `).join("|"),o=Array.from({length:e},()=>" --- ").join("|"),n=Array.from({length:e},()=>"   ").join("|");return`\n${[`|${t}|`,`|${o}|`,...Array.from({length:r},()=>`|${n}|`)].join("\n")}\n`}render(){return r`
      <k-dropdown @opened=${this.handleDropdownOpened}>
        <button slot="trigger" type="button" class="no-btn trigger" title="Table"><k-icon name="table"></k-icon></button>
        <div class="tbl-form" @keydown=${this.handleFormKeydown}>
          <input class="tbl-cols" type="number" min="1" max="20" inputmode="numeric" aria-label="Columns" value="3" />
          <span class="tbl-x" aria-hidden="true">×</span>
          <input class="tbl-rows" type="number" min="1" max="50" inputmode="numeric" aria-label="Rows" value="2" />
          <button type="button" class="primary" @click=${()=>this.submit()}>Insert</button>
        </div>
      </k-dropdown>
    `}static styles=[e.styles,t`
      :host { border: 1px solid var(--c_border); border-radius: var(--radius); margin: var(--spacer_q); }
      .trigger { display: inline-flex; align-items: center; justify-content: center; min-width: 2rem; min-height: 2rem; padding: var(--spacer_h); background: transparent; border: none; border-radius: var(--radius); cursor: pointer; }
      .trigger:hover { background: oklch(from var(--c_bg__inv) l c h / 0.15); }
      .tbl-form { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem; }
      .tbl-form input { width: 2.5rem; padding: 0.35rem 0.4rem; border: 1px solid var(--c_border); border-radius: var(--radius); font: inherit; text-align: center; -moz-appearance: textfield; }
      .tbl-form input::-webkit-inner-spin-button,
      .tbl-form input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      .tbl-x { color: var(--tc_muted); font-weight: bold; }
      .tbl-form button.primary { padding: 0.4rem 0.8rem; border: 1px solid var(--c_primary); border-radius: var(--radius); background: var(--c_primary); color: white; cursor: pointer; font: inherit; }
    `]}customElements.define("kc-md-table",n);