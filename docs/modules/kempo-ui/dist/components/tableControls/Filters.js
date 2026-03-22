import TableControl from"./TableControl.js";import{html,render}from"../../lit-all.min.js";import"../Icon.js";import Dialog from"../Dialog.js";export default class Filters extends TableControl{constructor(){super({maxWidth:40})}handleFilter=()=>{this.openDialog()};openDialog=()=>{const t={equals:"equals","not-equals":"does not equal",contains:"contains","not-contains":"does not contain","greater-than":"is greater than","greater-than-or-equal":"is greater than or equal to","less-than":"is less than","less-than-or-equal":"is less than or equal to"},e=document.createElement("div");render(html`
			<div class="p">
				${0===this.table.filters.length?html`
					<p>No Current Filters.</p>
				`:html`
					<h5>Current Filters</h5>
					<ul id="currentFilters">
						${this.table.filters.map(({field:e,condition:i,value:o})=>html`
							<li
								data-field="${e}"
								data-condition="${i}"
								data-value="${o}"
							>
								${this.table.getFieldLabel(e)} ${t[i]} "${o}"
								<button class="remove-filter no-btn pq" @click="${t=>{this.table.removeFilter(e,i,o),l.close(),this.openDialog()}}">
									<k-icon name="close"></k-icon>
								</button>
							</li>
						`)}
					</ul>
				`}
				<hr />
				<h5>Add A Filter</h5>
				<form id="addFilter" @submit="${t=>{t.preventDefault();const e=t.target;this.table.addFilter(e.filterField.value,e.filterCondition.value,e.filterValue.value),l.close(),this.openDialog()}}">
					<select id="filterField" class="mb">
						${this.table.fields.map(({name:t,label:e})=>html`
							<option value="${t}">${e}</option>
						`)}
					</select>
					<select id="filterCondition" class="mb">
						${Object.entries(t).map(([t,e])=>html`
							<option value="${t}" ?selected="${"contains"===t}">${e}</option>
						`)}
					</select>
					<input id="filterValue" type="text" class="mb" />
					<button type="submit" class="btn primary mb mr">Add Filter</button>
					${0===this.table.filters.length?"":html`
						<button type="button" class="btn danger mb mr" @click="${()=>{this.table.removeAllFilters(),l.close()}}">Clear All Filters</button>
					`}
				</form>
			</div>
		`,e);const l=Dialog.create(e,{width:"600px",title:"Filters"})};render(){return html`
			<button class="no-btn icon-btn" @click="${this.handleFilter}">
				<k-icon name="filter"></k-icon>
			</button>
		`}}customElements.define("k-tc-filters",Filters);