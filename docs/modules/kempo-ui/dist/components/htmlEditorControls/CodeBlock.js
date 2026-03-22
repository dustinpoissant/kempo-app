import HtmlEditorControl from"./HtmlEditorControl.js";import{html,css}from"../../lit-all.min.js";import"../Icon.js";export default class CodeBlock extends HtmlEditorControl{static properties={editorMode:{type:String,state:!0}};static styles=[HtmlEditorControl.styles,css`
			:host {
				display: inline-flex;
			}
		`];connectedCallback(){super.connectedCallback(),this.updateEditorMode(),this.editor?.addEventListener("mode-changed",()=>this.updateEditorMode())}handleMouseDown=t=>{const o=window.getSelection()?.toString();t.preventDefault(),t.stopPropagation(),this.editor&&(o?this.editor.wrapSelection("<pre>","</pre>",o):this.editor.formatBlock("pre"))};updateEditorMode(){this.editor&&(this.editorMode=this.editor.mode)}render(){return this.hidden="code"===this.editorMode,html`
			<button class="${this.buttonClasses}" @mousedown="${this.handleMouseDown}">
				<slot name="icon">
					<k-icon name="code_blocks"></k-icon>
				</slot>
				<slot></slot>
			</button>
		`}}customElements.define("k-hec-code-block",CodeBlock);