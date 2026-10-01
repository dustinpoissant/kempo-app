import e from"./Control.js";import{html as t,css as a}from"../../lit-all.min.js";export default class s extends e{static hostEvents=["pageChange","pageSizeChange","pageCountChanged","recordsSet"];handleSelectChange=e=>{this.host?.setPage(parseInt(e.target.value))};render(){const e=this.host,a=e?.getCurrentPage?.()??1,s=e?.getTotalPages?.()??1,l=[];for(let e=1;e<=s;e++)l.push(t`<option value="${e}" ?selected="${e===a}">Page ${e}</option>`);return t`
      <div class="page-select">
        <select @change=${this.handleSelectChange} ?disabled=${s<=1}>${l}</select>
        <label> out of ${s}</label>
      </div>
    `}static styles=[e.styles,a`
      :host { margin: var(--spacer_q); }
      .page-select { display: flex; align-items: center; gap: 0.25rem; white-space: nowrap; }
      label { padding: 0; margin: 0; }
    `]}customElements.define("kc-tc-page-select",s);