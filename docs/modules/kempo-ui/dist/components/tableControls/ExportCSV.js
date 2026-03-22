import TableControl from"./TableControl.js";import{html}from"../../lit-all.min.js";import"../Icon.js";export default class ExportCSV extends TableControl{constructor(){super(),this.maxWidth=136}getCSV(){const t=this.table;if(!t)return"";let e="";const o=[];if(t.fields.forEach(({name:t,calculator:e})=>{e||o.push(t)}),e+=o.join(",")+"\n",this.record){const t=o.map(t=>this.record[t]||"");e+=t.join(",")+"\n"}else t.records.forEach(t=>{const r=o.map(e=>t[e]||"");e+=r.join(",")+"\n"});return e}export=()=>{const t=this.getCSV(),e=new Blob([t],{type:"text/csv"}),o=URL.createObjectURL(e),r=document.createElement("a");r.href=o,r.download="data.csv",r.click(),URL.revokeObjectURL(o)};render(){return html`
			<button class="no-btn ph" @click="${this.export}">
				<slot>
					<k-icon name="export-file"></k-icon>
					Export CSV
				</slot>
			</button>
		`}}customElements.define("k-tc-export-csv",ExportCSV);