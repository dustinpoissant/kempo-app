import TableControl from"./TableControl.js";import{html}from"../../lit-all.min.js";import"../Icon.js";export default class ShowAll extends TableControl{constructor(){super({maxWidth:40})}handleShowAll=()=>{this.table&&this.table.showAllRecords()};render(){return html`
			<button class="no-btn icon-btn" @click="${this.handleShowAll}">
				<k-icon name="show"></k-icon>
			</button>
		`}}customElements.define("k-tc-show-all",ShowAll);