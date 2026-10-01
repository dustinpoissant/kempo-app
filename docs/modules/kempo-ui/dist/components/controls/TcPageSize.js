import e from"./Control.js";import{html as t,css as s}from"../../lit-all.min.js";export default class a extends e{static hostEvents=["pageChange","pageSizeChange"];handleChange=e=>{this.host?.setPageSize(parseInt(e.target.value))};render(){const e=this.host,s=e?.getPageSize?.()??10,a=e?.pageSizeOptions??[10,25,50,100,500];return t`
      <select @change=${this.handleChange}>
        ${a.map(e=>t`<option value="${e}" ?selected="${e===s}">${e} per page</option>`)}
      </select>
    `}static styles=[e.styles,s`:host { margin: var(--spacer_q); }`]}customElements.define("kc-tc-page-size",a);