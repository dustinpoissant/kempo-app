import HtmlEditorControl from"./HtmlEditorControl.js";import{html,css}from"../../lit-all.min.js";import"../Icon.js";export default class FormatBlock extends HtmlEditorControl{static properties={editorMode:{type:String,state:!0},tag:{type:String},label:{type:String}};static styles=[HtmlEditorControl.styles,css`
			:host {
				display: inline-flex;
			}
		`];constructor(){super(),this.tag="p",this.label=""}connectedCallback(){super.connectedCallback(),this.updateEditorMode(),this.editor?.addEventListener("mode-changed",()=>this.updateEditorMode())}handleClick=()=>{this.editor&&this.editor.formatBlock(this.tag)};updateEditorMode(){this.editor&&(this.editorMode=this.editor.mode)}render(){this.hidden="code"===this.editorMode;this.label||this.getDefaultLabel();const t=this.getDefaultIcon();return html`
			<button class="${this.buttonClasses}" @click="${this.handleClick}">
				<slot name="icon">
					<k-icon name="${t}"></k-icon>
				</slot>
				<slot></slot>
			</button>
		`}getDefaultLabel(){return{h1:"Heading 1",h2:"Heading 2",h3:"Heading 3",h4:"Heading 4",h5:"Heading 5",h6:"Heading 6",p:"Paragraph"}[this.tag]||this.tag.toUpperCase()}getDefaultIcon(){return{h1:"format_h1",h2:"format_h2",h3:"format_h3",h4:"format_h4",h5:"format_h5",h6:"format_h6",p:"format_paragraph"}[this.tag]||"format_paragraph"}}customElements.define("k-hec-format-block",FormatBlock);