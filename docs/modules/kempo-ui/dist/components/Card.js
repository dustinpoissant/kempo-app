import a from"./ShadowComponent.js";import{html as r,css as e}from"../lit-all.min.js";export default class i extends a{static properties={label:{type:String,reflect:!0}};constructor(){super(),this.label=null}static styles=e`
		:host {
			display: block;
		}
		/*
			Padding and the trailing margin are themeable, matching --aside_padding on Aside. A card
			used as a tile in a grid wants its media flush to the border and its own gap handling,
			neither of which is reachable from outside a shadow root otherwise.
		*/
		#card {
			border: 1px solid var(--c_border);
			border-radius: var(--radius);
			margin-bottom: var(--card_margin, var(--spacer));
			padding: var(--card_padding, var(--spacer));
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
	`;render(){return r`
			<div id="card">
				<div id="label">${this.label}</div>
				<slot></slot>
			</div>
		`}}window.customElements.define("k-card",i);