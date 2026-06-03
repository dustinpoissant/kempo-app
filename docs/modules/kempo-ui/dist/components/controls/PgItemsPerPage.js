import e from"./Control.js";import{html as t,css as s}from"../../lit-all.min.js";export default class a extends e{static hostEvents=["page-change"];handleChange=e=>{const t=this.host;t&&(t.itemsPerPage=parseInt(e.target.value,10))};render(){const e=this.host,s=e?.itemsPerPage??10,a=e?.pageSizes??[5,10,25,50,100];return t`
      <label>
        <slot>Items per page:</slot>
        <select @change=${this.handleChange}>
          ${a.map(e=>t`<option value=${e} ?selected=${e===s}>${e}</option>`)}
        </select>
      </label>
    `}static styles=[e.styles,s`
      :host { align-items: center; }
      label { display: inline-flex; align-items: center; gap: var(--spacer_q, 0.25rem); padding: 0; white-space: nowrap; }
      select { min-height: 2.5rem; box-sizing: border-box; }
    `]}customElements.define("kc-pg-items-per-page",a);