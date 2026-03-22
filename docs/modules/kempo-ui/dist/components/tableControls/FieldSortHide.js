import TableControl from"./TableControl.js";import{html,render}from"../../lit-all.min.js";import"../Icon.js";import Dialog from"../Dialog.js";export default class FieldSortHide extends TableControl{constructor(){super({maxWidth:40})}handleClick=()=>{this.openDialog()};openDialog=()=>{import("../Sortable.js");const e=document.createElement("div");render(html`
			<div class="m">
				<k-sortable id="sorting" @sort="${e=>{const t=Array.from(e.target.querySelectorAll("k-sortable-item")).map(e=>e.getAttribute("data-field"));this.table.reorderFields(t)}}">
					${this.table.fields.map(e=>html`
						<k-sortable-item data-field="${e.name}">
							<label class="field pb0">
								<input
									class="field-visibility"
									data-field="${e.name}"
									type="checkbox"
									.checked="${!e.hidden}"
									@change="${t=>{this.table.setFieldHiddenState(e.name,!t.target.checked)}}"
									style="height: 1.25rem; width: 1.25rem"
								/>
								${e.label}
							</label>
						</k-sortable-item>
					`)}
				</k-sortable>
			</div>
		`,e),Dialog.create(e,{title:"Show / Hide / Order Fields",width:"400px",cancelText:"Close"})};render(){return html`
			<button class="no-btn icon-btn" @click="${this.handleClick}">
				<k-icon name="table-visibility"></k-icon>
			</button>
		`}}customElements.define("k-tc-field-sort-hide",FieldSortHide);