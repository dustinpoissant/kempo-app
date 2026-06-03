import t from"./ShadowComponent.js";import{html as e,css as i}from"../lit-all.min.js";export default class s extends t{static properties={hidden:{type:Boolean,reflect:!0}};constructor(){super(),this.hidden=!1}connectedCallback(){super.connectedCallback(),this.hasAttribute("class")||this.setAttribute("class","b r mq"),this.addEventListener("control_visibility_change",this.checkVisibility)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("control_visibility_change",this.checkVisibility)}checkVisibility=t=>{if(t.target===this)return;const e=this.hidden;this.hidden=Array.from(this.children).every(t=>!0===t.hidden),this.hidden!==e&&this.dispatchEvent(new CustomEvent("control_visibility_change",{bubbles:!0}))};static styles=i`
		:host {
			display: inline-flex;
		}
		:host([hidden]) {
			display: none !important;
		}
		::slotted(*) {
			border: 0;
			border-right: 1px solid var(--c_border);
			border-radius: 0;
			margin: 0;
		}
		::slotted(*:last-child) {
			border-right: 0;
		}
	`;render(){return e`<slot></slot>`}}customElements.define("k-control-group",s);