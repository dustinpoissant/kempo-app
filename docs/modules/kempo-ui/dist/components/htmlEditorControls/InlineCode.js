import HtmlEditorControl from"./HtmlEditorControl.js";import{html,css}from"../../lit-all.min.js";import"../Icon.js";export default class InlineCode extends HtmlEditorControl{static properties={editorMode:{type:String,state:!0}};static styles=[HtmlEditorControl.styles,css`
			:host {
				display: inline-flex;
			}
		`];connectedCallback(){super.connectedCallback(),this.updateEditorMode(),this.editor?.addEventListener("mode-changed",()=>this.updateEditorMode())}handleMouseDown=t=>{if(!this.editor)return;t.preventDefault(),t.stopPropagation();const e=document.createElement("code"),o=this.editor.getValueWithSelectionMarkers();o.hasSelection?(e.textContent=o.selectedText,this.editor.replaceSelectionWithElement(e,!0)):(e.textContent="​",this.editor.insertElementAtCursor(e,!0))};updateEditorMode(){this.editor&&(this.editorMode=this.editor.mode)}render(){return this.hidden="code"===this.editorMode,html`
			<button class="${this.buttonClasses}" @mousedown="${this.handleMouseDown}">
				<slot name="icon">
					<k-icon name="code_blocks"></k-icon>
				</slot>
				<slot></slot>
			</button>
		`}}customElements.define("k-hec-inline-code",InlineCode);