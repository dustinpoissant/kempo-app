import TableControl from"./TableControl.js";import{html,css}from"../../lit-all.min.js";import"../Icon.js";export default class Edit extends TableControl{static properties={isEditing:{type:Boolean}};static styles=[TableControl.styles,css`
			:host {
				display: inline-flex;
				width: max-content;
				align-items: baseline;
			}
		`];constructor(){super({maxWidth:80})}connectedCallback(){super.connectedCallback(),this.onTableEvent("editingChange",this.handleEditingChange)}handleEditingChange=t=>{t.detail.record===this.record&&(this.isEditing=t.detail.editing)};handleEdit=()=>{this.record&&this.table.editRecord(this.record)};handleSave=()=>{this.record&&this.table.saveEditedRecord(this.record)};handleCancel=()=>{this.record&&this.table.cancelEditedRecord(this.record)};render(){return this.isEditing?html`
			<button class="no-btn icon-btn bg-success" @click="${this.handleSave}">
				<k-icon name="check"></k-icon>
			</button>
			<button class="no-btn icon-btn bg-danger" @click="${this.handleCancel}">
				<k-icon name="close"></k-icon>
			</button>
		`:html`
			<button class="no-btn icon-btn" @click="${this.handleEdit}">
				<k-icon name="edit"></k-icon>
			</button>
		`}}customElements.define("k-tc-edit",Edit);