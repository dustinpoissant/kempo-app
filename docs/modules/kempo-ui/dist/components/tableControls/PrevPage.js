import TableControl from"./TableControl.js";import{html}from"../../lit-all.min.js";import"../Icon.js";export default class PrevPage extends TableControl{constructor(){super(),this.pageChangeHandler=()=>this.requestUpdate()}connectedCallback(){super.connectedCallback(),this.table&&this.table.addEventListener("pageChange",this.pageChangeHandler)}disconnectedCallback(){super.disconnectedCallback(),this.table&&this.table.removeEventListener("pageChange",this.pageChangeHandler)}handleClick=()=>{this.table&&this.table.prevPage()};get isDisabled(){return!this.table||1===this.table.getCurrentPage()}render(){return html`
			<button 
				class="no-btn icon-btn" 
				?disabled="${this.isDisabled}"
				@click="${this.handleClick}"
			>
				<k-icon name="chevron" direction="left"></k-icon>
			</button>
		`}}customElements.define("k-tc-prev-page",PrevPage);