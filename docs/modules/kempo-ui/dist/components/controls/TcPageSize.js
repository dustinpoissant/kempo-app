import e from"./Control.js";import{html as t}from"../../lit-all.min.js";export default class a extends e{static hostEvents=["pageChange","pageSizeChange"];handleChange=e=>{this.host?.setPageSize(parseInt(e.target.value))};render(){const e=this.host,a=e?.getPageSize?.()??10,s=e?.pageSizeOptions??[10,25,50,100,500];return t`
      <select @change=${this.handleChange}>
        ${s.map(e=>t`<option value="${e}" ?selected="${e===a}">${e} per page</option>`)}
      </select>
    `}}customElements.define("kc-tc-page-size",a);