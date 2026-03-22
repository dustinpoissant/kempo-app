import TableControl from"./TableControl.js";import{html}from"../../lit-all.min.js";import"../Icon.js";export default class Hide extends TableControl{constructor(){super({maxWidth:40})}handleHide=()=>{this.record&&this.table.hideRecord(this.record)};render(){return html`
			<button class="no-btn icon-btn" @click="${this.handleHide}">
				<k-icon name="hide"></k-icon>
			</button>
		`}}customElements.define("k-tc-hide",Hide);