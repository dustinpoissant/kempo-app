import TableControl from"./TableControl.js";import{html}from"../../lit-all.min.js";import"../Icon.js";export default class DeleteSelected extends TableControl{deleteSelected=()=>{this.table.deleteSelected()};render(){return html`
			<button class="no-btn icon-btn" title="Delete Selected" @click="${this.deleteSelected}">
				<slot>
					<k-icon name="delete_sweep"></k-icon>
				</slot>
			</button>
		`}}customElements.define("k-tc-delete-selected",DeleteSelected);