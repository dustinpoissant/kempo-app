import t from"./Control.js";import{html as e,css as o}from"../../lit-all.min.js";import"../Combobox.js";export default class s extends t{static hostEvents=["page-change"];handleInput=t=>{const e=this.host;if(e&&t.target.value){const o=parseInt(t.target.value,10);!isNaN(o)&&o>0&&(e.page=o)}};handleBlur=t=>{const e=this.host;e&&(t.target.value=String(e.page))};render(){const t=this.host,o=t?.page??1,s=t?.totalPages??1;return e`
      <k-combobox
        .value=${String(o)}
        @input=${this.handleInput}
        @blur=${this.handleBlur}
        placeholder="page"
        no-results-message="Invalid Page"
      >
        ${Array.from({length:s},(t,o)=>e`
          <k-option value=${o+1}>${o+1}</k-option>
        `)}
      </k-combobox>
    `}static styles=[t.styles,o`
      k-combobox { width: 5rem; }
    `]}customElements.define("kc-pg-goto-page",s);