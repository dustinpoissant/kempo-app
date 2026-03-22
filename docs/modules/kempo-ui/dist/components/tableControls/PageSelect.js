import TableControl from"./TableControl.js";import{html,css}from"../../lit-all.min.js";export default class PageSelect extends TableControl{static properties={...TableControl.properties};constructor(){super({maxWidth:null})}connectedCallback(){super.connectedCallback(),this.onTableEvent("pageChange pageSizeChange pageCountChanged recordsSet",this.handleTableUpdate)}disconnectedCallback(){super.disconnectedCallback(),this.table&&(this.table.removeEventListener("pageChange",this.handleTableUpdate),this.table.removeEventListener("pageSizeChange",this.handleTableUpdate),this.table.removeEventListener("pageCountChanged",this.handleTableUpdate),this.table.removeEventListener("recordsSet",this.handleTableUpdate))}handleTableUpdate=()=>{this.requestUpdate()};handleSelectChange=e=>{this.table&&this.table.setPage(parseInt(e.target.value))};get currentPage(){return this.table?this.table.getCurrentPage():1}get totalPages(){return this.table?this.table.getTotalPages():1}render(){if(!this.table)return html`<div>No table found</div>`;const e=[];for(let t=1;t<=this.totalPages;t++)e.push(html`<option value="${t}" ?selected="${t===this.currentPage}">Page ${t}</option>`);return html`
			<div class="page-select">
				<select class="no-btn ph b r" @change="${this.handleSelectChange}" ?disabled="${this.totalPages<=1}">
					${e}
				</select>
				<label> out of ${this.totalPages}</label>
			</div>
		`}static styles=css`
		${TableControl.styles}
		
		.page-select {
			display: flex;
			align-items: center;
			gap: 0.25rem;
			white-space: nowrap;
		}
		
		label {
			padding: 0;
			margin: 0;
		}
	`}customElements.define("k-tc-page-select",PageSelect);