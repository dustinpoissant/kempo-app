import ShadowComponent from"./ShadowComponent.js";import{html,css}from"../lit-all.min.js";export default class Card extends ShadowComponent{static properties={label:{type:String,reflect:!0}};constructor(){super(),this.label=null}static styles=css`
		:host {
			display: block;
		}
		#card {
			border: 1px solid var(--c_border);
			border-radius: var(--radius);
			margin-bottom: var(--spacer);
			padding: var(--spacer);
			position: relative;
			background-color: var(--c_bg);
		}
		#label {
			position: absolute;
			top: -1.25em;
			left: 1.25em;
			background-color: var(--c_bg);
			border: 1px solid var(--c_border);
			border-radius: var(--radius);
			padding: var(--spacer_h);
		}
		:host([label]) {
			padding-top: 0.1px; /* Prevent Collapsing Margins */
		}
		:host([label]) #card {
			padding-top: calc(1.5 * var(--spacer));
			margin-top: var(--spacer);
		}
		:host(:not([label])) #label {
			display: none;
		}
	`;render(){return html`
			<div id="card">
				<div id="label">${this.label}</div>
				<slot></slot>
			</div>
		`}}window.customElements.define("k-card",Card);