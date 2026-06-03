import{LitElement as t,html as e}from"../lit-all.min.js";export default class o extends t{static shadowRootOptions={mode:"open",delegatesFocus:!0};afterFocus=()=>{this.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').focus()};render(){return e`
			<slot></slot>
			<div
				tabindex="0"
				@focus=${this.afterFocus}
			></div>
		`}}window.customElements.define("k-focus-capture",o);