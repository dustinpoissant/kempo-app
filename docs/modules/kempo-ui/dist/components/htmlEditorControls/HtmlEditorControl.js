import ShadowComponent from"../ShadowComponent.js";import{html,css}from"../../lit-all.min.js";export default class HtmlEditorControl extends ShadowComponent{static properties={btnClass:{type:String,attribute:"btn-class"},groupBtnClass:{type:String,attribute:"group-btn-class"},groupLastBtnClass:{type:String,attribute:"group-last-btn-class"},hidden:{type:Boolean,reflect:!0}};constructor(){super(),this.btnClass="b r mq ph",this.groupBtnClass="br ph",this.groupLastBtnClass="ph"}get editor(){let t=this.getRootNode();for(;t instanceof ShadowRoot;){const o=t.host,n=o.closest("k-html-editor");if(n)return n;t=o.getRootNode()}return this.closest("k-html-editor")}get isInGroup(){const t=this.parentElement;return t&&"K-HEC-GROUP"===t.tagName}get isInDropdown(){const t=this.parentElement;return t&&"K-HEC-DROPDOWN"===t.tagName}get isLastInGroup(){if(!this.isInGroup)return!1;const t=this.parentElement,o=Array.from(t.children).filter(t=>t.tagName.startsWith("K-HEC-")&&"K-HEC-SPACER"!==t.tagName);return o[o.length-1]===this}get buttonClasses(){let t;return t=this.isInDropdown?"dropdown-item":this.isInGroup?this.isLastInGroup?this.groupLastBtnClass:this.groupBtnClass:this.btnClass,`no-btn icon-btn ${t}`.trim()}static styles=css`
		:host {
			display: inline-flex;
		}
		
		:host([hidden]) {
			display: none !important;
		}
		
		.icon-btn {
			display: inline-flex !important;
			align-items: center;
			justify-content: center;
			width: 40px;
			height: 40px;
			gap: 0.5rem;
		}
		.icon-btn:disabled {
			opacity: 0.6;
		}
		
		.icon-btn:has(slot:not([name])) {
			width: auto;
			padding-left: 0.75rem;
			padding-right: 0.75rem;
		}
		
		/* Styles for controls in dropdown */
		.icon-btn.dropdown-item {
			display: flex !important;
			width: 100% !important;
			height: auto !important;
			justify-content: flex-start !important;
			padding: 0.5rem 0.75rem !important;
			margin: 0 !important;
			border: none !important;
			border-radius: 0 !important;
			border-bottom: 1px solid var(--c_border) !important;
		}
		
		:host(:last-child) .icon-btn.dropdown-item {
			border-bottom: none !important;
		}
	`}customElements.define("k-html-editor-control",HtmlEditorControl);