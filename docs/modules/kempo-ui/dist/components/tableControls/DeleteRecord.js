import TableControl from"./TableControl.js";import{html}from"../../lit-all.min.js";import"../Icon.js";export default class DeleteRecord extends TableControl{delete=()=>{this.record&&this.table.deleteRecord(this.record)};render(){return html`
			<button class="no-btn icon-btn" @click="${this.delete}">
				<slot>
					<k-icon name="delete"></k-icon>
				</slot>
			</button>
		`}}customElements.define("k-tc-delete-record",DeleteRecord);