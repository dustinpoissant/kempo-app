import t from"./ShadowComponent.js";import{html as o,css as s}from"../lit-all.min.js";export default class e extends t{render(){return o`<slot></slot>`}static styles=s`
		:host {
			display: contents;
		}
		:host([hidden]) {
			display: none !important;
		}
		:host([kb-focus]) ::slotted(a) {
			background: rgba(128,128,128,.25);
		}
	`}customElements.define("k-filter-item",e);