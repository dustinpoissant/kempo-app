import{LitElement,html}from"../lit-all.min.js";export default class FocusCapture extends LitElement{static shadowRootOptions={mode:"open",delegatesFocus:!0};afterFocus=()=>{this.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').focus()};render(){return html`
			<slot></slot>
			<div
				tabindex="0"
				@focus=${this.afterFocus}
			></div>
		`}}window.customElements.define("k-focus-capture",FocusCapture);