import ShadowComponent from"../ShadowComponent.js";import{html,css}from"../../lit-all.min.js";export default class ControlSpacer extends ShadowComponent{static styles=css`
		:host {
			display: inline-flex;
			flex: 1;
		}
	`;render(){return html``}}customElements.define("k-hec-spacer",ControlSpacer);