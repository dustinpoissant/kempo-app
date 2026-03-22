import HtmlEditorControl from"./HtmlEditorControl.js";import{html,css}from"../../lit-all.min.js";import"../Icon.js";export default class AlignCenter extends HtmlEditorControl{static properties={editorMode:{type:String,state:!0}};static styles=[HtmlEditorControl.styles,css`
			:host {
				display: inline-flex;
			}
		`];connectedCallback(){super.connectedCallback(),this.updateEditorMode(),this.editor?.addEventListener("mode-changed",()=>this.updateEditorMode())}handleClick=()=>{this.editor&&this.editor.alignCenter()};updateEditorMode(){this.editor&&(this.editorMode=this.editor.mode)}render(){return this.hidden="code"===this.editorMode,html`
			<button class="${this.buttonClasses}" @click="${this.handleClick}">
				<slot name="icon">
					<k-icon name="format_align_center"></k-icon>
				</slot>
				<slot></slot>
			</button>
		`}}customElements.define("k-hec-align-center",AlignCenter);