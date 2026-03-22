import ShadowComponent from"../ShadowComponent.js";import{html,css}from"../../lit-all.min.js";export default class ControlGroup extends ShadowComponent{static properties={editorMode:{type:String,state:!0},hidden:{type:Boolean,reflect:!0}};constructor(){super()}connectedCallback(){super.connectedCallback(),this.hasAttribute("class")||this.setAttribute("class","b r mq"),this.updateEditorMode(),this.editor?.addEventListener("mode-changed",()=>this.updateEditorMode())}get editor(){return this.closest("k-html-editor")}updateEditorMode(){this.editor&&(this.editorMode=this.editor.mode,this.requestUpdate())}hasVisibleChildren(){return Array.from(this.children).filter(t=>t.tagName.startsWith("K-HEC-")&&"K-HEC-SPACER"!==t.tagName).some(t=>{if(!1===t.hidden||void 0===t.hidden){return"none"!==window.getComputedStyle(t).display}return!1})}static styles=css`
		:host {
			display: inline-flex;
		}
		
		:host([hidden]) {
			display: none !important;
		}
		
		::slotted(*) {
			margin-top: -1px;
			margin-bottom: -1px;
		}
	`;render(){return html`<slot></slot>`}updated(){super.updated(),requestAnimationFrame(()=>{this.hidden=!this.hasVisibleChildren()})}}customElements.define("k-hec-group",ControlGroup);